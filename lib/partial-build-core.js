'use strict'

const fs = require('node:fs')
const fsp = fs.promises
const path = require('node:path')
const { createHash } = require('node:crypto')
const { randomUUID } = require('node:crypto')
const SCHEMA = 1
const hash = (value) => createHash('sha256').update(Buffer.isBuffer(value) ? value : String(value)).digest('hex')
const pair = ({ component, version }) => `${version || '_'}@${component}`
const fileKey = (file) => `${pair(file.src)}:${file.src.module || 'ROOT'}:${file.src.family}:${file.src.relative}`
const within = (parent, child) => { const rel = path.relative(path.resolve(parent), path.resolve(child)); return !rel || (!rel.startsWith('..') && !path.isAbsolute(rel)) }
const stable = (value) => JSON.stringify(canonical(value))
const serializeDependencies = (edges) => Object.fromEntries(Object.entries(edges).map(([key, values]) => [key, [...values].sort()]))
function trackIncludes (catalog, outerFile, edges, uncertain, loading) {
  const consumer = fileKey(outerFile)
  return new Proxy(catalog, { get (target, name) {
    const value = target[name]
    if (typeof value !== 'function') return value
    if (!['resolveResource', 'getByPath'].includes(name)) return value.bind(target)
    return (...args) => {
      const result = value.apply(target, args)
      // Antora resolves includes while loading; xrefs/images are resolved later
      // during conversion and must not become content-include dependencies.
      if (loading()) {
        if (result?.src) (edges[fileKey(result)] ||= new Set()).add(consumer)
        else uncertain.add(consumer) // e.g. an optional missing include
      }
      return result
    }
  } })
}
function committedOnly (playbook) {
  playbook.content.worktrees = false
  playbook.content.sources.forEach((source) => { source.worktrees = false })
}
function checkOrigins (origins) {
  if (!origins.length || origins.some((origin) => origin.worktree || !/^[a-f0-9]{40,64}$/.test(origin.refhash || ''))) {
    throw new Error('Committed Git sources required; worktree content is forbidden')
  }
}
function mergeNavigation (catalog, targets, navigation) {
  for (const component of catalog.getComponents()) {
    for (const version of component.versions) {
      const id = pair({ component: component.name, version: version.version })
      if (!targets.has(id)) version.navigation = JSON.parse(JSON.stringify(navigation[id]))
    }
  }
}
async function acquireLock (repo) {
  const name = path.join(repo, 'build/partial-build/build.lock')
  await fsp.mkdir(path.dirname(name), { recursive: true })
  let handle
  try { handle = await fsp.open(name, 'wx') } catch (err) {
    if (err.code === 'EEXIST') throw new Error(`Another build is running, or a previous process crashed. Check before removing lock: ${name}`)
    throw err
  }
  await handle.writeFile(JSON.stringify({ pid: process.pid, started: new Date().toISOString() }) + '\n')
  return { release: async () => { await handle.close(); await fsp.unlink(name) } }
}
async function promote (staging, destination, repo) {
  if (!within(repo, staging) || !within(repo, destination) || within(staging, destination) || within(destination, staging)) {
    throw new Error('Unsafe final output paths')
  }
  for (let dir = destination; within(repo, dir); dir = path.dirname(dir)) {
    if (fs.existsSync(dir) && fs.lstatSync(dir).isSymbolicLink()) throw new Error('Symlink final output ancestors are forbidden')
    if (dir === path.resolve(repo)) break
  }
  const backup = path.join(repo, 'build/partial-build/backups', randomUUID())
  await fsp.mkdir(path.dirname(backup), { recursive: true })
  await fsp.mkdir(path.dirname(destination), { recursive: true })
  const existed = fs.existsSync(destination)
  if (existed) await fsp.rename(destination, backup)
  try { await fsp.rename(staging, destination) } catch (err) {
    if (existed) await fsp.rename(backup, destination)
    throw err
  }
}
function canonical (value) {
  return Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])])) : value
}

function readRequest (env) {
  const mode = env.ANTORA_BUILD_MODE === undefined ? 'full' : env.ANTORA_BUILD_MODE.trim().toLowerCase()
  if (!['full', 'partial', 'auto'].includes(mode)) throw new Error('ANTORA_BUILD_MODE must be full, partial, or auto')
  const value = env.ANTORA_BUILD_TARGETS
  if (value !== undefined && !value.trim()) throw new Error('ANTORA_BUILD_TARGETS must not be empty')
  const entries = value === undefined ? [] : value.split(',').map((it) => it.trim())
  if (entries.some((it) => !/^[^\s@,:]+@[^\s@,:]+$/.test(it))) {
    throw new Error('ANTORA_BUILD_TARGETS requires comma-separated version@component pairs (_ means unversioned)')
  }
  if (new Set(entries).size !== entries.length) throw new Error('Duplicate build targets')
  if (mode === 'full' && entries.length) throw new Error('Full mode does not accept ANTORA_BUILD_TARGETS')
  if (mode !== 'full' && !entries.length) throw new Error('Partial/auto mode requires ANTORA_BUILD_TARGETS')
  for (const name of ['ANTORA_BUILD_BASELINE', 'ANTORA_BUILD_OUTPUT']) {
    if (env[name] !== undefined && !env[name].trim()) throw new Error(`${name} must not be empty`)
  }
  return { mode, targets: new Set(entries) }
}

function newOutput (repo, requested) {
  const output = path.resolve(repo, requested), build = path.join(repo, 'build')
  if (!within(build, output) || path.resolve(build) === output) throw new Error('Output must be a new directory under the playbook build directory')
  if (fs.existsSync(output)) throw new Error(`Output already exists; choose a new directory: ${output}`)
  for (let dir = path.dirname(output); within(repo, dir); dir = path.dirname(dir)) {
    if (fs.existsSync(dir) && fs.lstatSync(dir).isSymbolicLink()) throw new Error('Symlink output ancestors are forbidden')
    if (dir === path.resolve(repo)) break
  }
  return output
}

function digestPath (name) {
  if (!fs.existsSync(name)) throw new Error(`Required configuration resource missing: ${name}`)
  if (fs.lstatSync(name).isSymbolicLink()) throw new Error(`Symlink configuration resource: ${name}`)
  if (fs.statSync(name).isFile()) return hash(fs.readFileSync(name))
  return hash(stable(fs.readdirSync(name).sort().map((entry) => [entry, digestPath(path.join(name, entry))])))
}

function configurationSignature (playbook, repo) {
  const resources = { implementation: digestPath(__filename), extension: digestPath(path.join(__dirname, 'partial-build.js')) }
  for (const name of ['package-lock.json', 'antora-navigator.yml']) {
    if (fs.existsSync(path.join(repo, name))) resources[name] = digestPath(path.join(repo, name))
  }
  const ui = playbook.ui || {}
  if (typeof ui.bundle?.url === 'string') {
    if (/^https?:/.test(ui.bundle.url)) throw new Error('Verification requires a local fingerprinted UI bundle')
    resources.ui = digestPath(path.resolve(repo, ui.bundle.url))
  }
  if (typeof ui.supplementalFiles === 'string') resources.supplemental = digestPath(path.resolve(repo, ui.supplementalFiles))
  for (const entry of playbook.antora?.extensions || []) {
    const request = typeof entry === 'string' ? entry : entry.require
    if (request?.startsWith('./')) resources[request] = digestPath(path.resolve(repo, request))
    const configFile = typeof entry === 'object' && (entry.configFile || entry.config_file)
    if (configFile) resources[configFile] = digestPath(path.resolve(repo, configFile))
  }
  return hash(stable({ site: playbook.site, urls: playbook.urls, content: playbook.content,
    asciidoc: playbook.asciidoc, ui, extensions: playbook.antora?.extensions, resources }))
}

function capture (catalog, sourceFiles, metadata, signature, origins) {
  const files = {}, dependencies = {}, uncertain = []
  for (const file of sourceFiles) {
    const key = fileKey(file)
    files[key] = { hash: hash(file.contents || ''), pair: pair(file.src), family: file.src.family,
      path: file.src.path, metadata: metadata[key] }
  }
  const components = Object.fromEntries(catalog.getComponents().flatMap((component) => component.versions.map((version) =>
    [pair({ component: component.name, version: version.version }), {
      title: version.title, displayVersion: version.displayVersion, prerelease: version.prerelease || false,
      latest: component.latest.version, activeVersionSegment: version.activeVersionSegment,
      attributes: version.asciidoc?.attributes, url: version.url,
      descriptors: [...version.origins].map((origin) => origin.descriptor),
    }])))
  return { schema: SCHEMA, signature, origins, files, components, dependencies, uncertain: [...new Set(uncertain)] }
}

function assess (request, current, baseline, baselineProblem) {
  const reasons = [], targets = request.targets
  for (const target of targets) if (!(target in current.components)) throw new Error(`Unknown component/version: ${target}`)
  if (request.mode === 'full') return { mode: 'full', reasons }
  if (!baseline) reasons.push(baselineProblem || 'No baseline')
  else {
    if (baseline.schema !== SCHEMA) reasons.push('Unsupported baseline schema')
    if (baseline.signature !== current.signature) reasons.push('Global configuration/UI/extensions changed')
    if (stable(baseline.components) !== stable(current.components)) reasons.push('Component/version inventory or descriptor attributes changed')
    if (!baseline.navigation || Object.keys(current.components).some((key) => !Array.isArray(baseline.navigation[key]))) reasons.push('Navigation snapshot missing or incomplete')
    const changed = new Set([...Object.keys(baseline.files), ...Object.keys(current.files)]
      .filter((key) => baseline.files[key]?.hash !== current.files[key]?.hash))
    for (const key of changed) {
      const before = baseline.files[key], after = current.files[key]
      if (!after) { reasons.push(`Removed resource: ${key}`); continue }
      if (!targets.has(after.pair)) reasons.push(`Changed resource outside selection: ${key}`)
      if (before && stable(before.metadata) !== stable(after.metadata)) reasons.push(`Changed page title/xref metadata: ${key}`)
      const queue = [key], visited = new Set()
      while (queue.length) {
        const dependency = queue.pop()
        if (visited.has(dependency)) continue
        visited.add(dependency)
        for (const consumer of new Set([...(baseline.dependencies[dependency] || []), ...(current.dependencies[dependency] || [])])) {
          const file = current.files[consumer] || baseline.files[consumer]
          if (file && !targets.has(file.pair)) reasons.push(`Include consumer outside selection: ${consumer}`)
          queue.push(consumer)
        }
      }
    }
    if (changed.size && [...new Set([...(baseline.uncertain || []), ...current.uncertain])]
      .some((key) => !targets.has((current.files[key] || baseline.files[key])?.pair))) {
      reasons.push('Unresolved/dynamic include outside selection; dependency safety cannot be established')
    }
  }
  const unique = [...new Set(reasons)]
  if (unique.length && request.mode === 'partial') throw new Error(`Partial build refused: ${unique.slice(0, 12).join('; ')}`)
  return { mode: unique.length ? 'full' : 'partial', reasons: unique }
}

async function inventory (dir, prefix = '') {
  const result = {}
  for (const entry of await fsp.readdir(path.join(dir, prefix), { withFileTypes: true })) {
    if (!prefix && entry.name === '.partial-build') continue
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Symlink in site output: ${relative}`)
    if (entry.isDirectory()) Object.assign(result, await inventory(dir, relative))
    else result[relative] = hash(await fsp.readFile(path.join(dir, relative)))
  }
  return result
}

async function verifyInventory (dir, expected) {
  if (!expected || !Object.keys(expected).length) throw new Error('Baseline has no file inventory')
  if (stable(await inventory(dir)) !== stable(expected)) throw new Error('Baseline files changed or are missing; run a full build')
}

async function copyBaseline (source, output, expected) {
  // Copy the exact verified inventory, not an uncontrolled directory tree.
  // Validate each buffer again while reading so a concurrent edit cannot slip
  // between baseline verification and copying. Never reuse an output directory.
  await fsp.mkdir(path.dirname(output), { recursive: true })
  await fsp.mkdir(output)
  const entries = Object.entries(expected)
  let cursor = 0
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (cursor < entries.length) {
      const [relative, checksum] = entries[cursor++]
      const from = path.resolve(source, relative), to = path.resolve(output, relative)
      if (!within(source, from) || !within(output, to)) throw new Error('Unsafe baseline inventory path')
      const contents = await fsp.readFile(from)
      if (hash(contents) !== checksum) throw new Error(`Baseline changed during copying: ${relative}`)
      await fsp.mkdir(path.dirname(to), { recursive: true })
      await fsp.writeFile(to, contents, { flag: 'wx' })
    }
  }))
}

async function readBaseline (dir) {
  if ((await fsp.lstat(dir)).isSymbolicLink()) throw new Error('Symlink baseline directories are forbidden')
  const value = JSON.parse(await fsp.readFile(path.join(dir, '.partial-build/state.json'), 'utf8'))
  if (value.schema !== SCHEMA || !value.files || !value.components || !value.dependencies || !value.origins) throw new Error('Invalid baseline state')
  if (value.origins.some((origin) => !/^[a-f0-9]{40,64}$/.test(origin.sha || ''))) throw new Error('Baseline lacks source SHA')
  await verifyInventory(dir, value.inventory)
  return value
}

module.exports = { SCHEMA, hash, pair, fileKey, within, stable, readRequest, newOutput, capture,
  configurationSignature, assess, inventory, verifyInventory, readBaseline,
  committedOnly, checkOrigins, mergeNavigation, acquireLock, trackIncludes, serializeDependencies, promote, copyBaseline }
