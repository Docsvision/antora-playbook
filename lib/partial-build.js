'use strict'

// Antora 3.2: read all committed sources, convert only selected component versions.
const fs = require('node:fs')
const fsp = fs.promises
const path = require('node:path')
const { randomUUID } = require('node:crypto')
const core = require('./partial-build-core')
const clone = (value) => JSON.parse(JSON.stringify(value))

module.exports.register = function () {
  const started = performance.now()
  let aggregatedAt, convertedAt, output, destination, baseDir, baseline, baselineProblem, signature, request, current
  let mode, selected, metadata
  let lock
  const dependencies = {}, uncertain = new Set()
  const root = this.getLogger()
  const logger = this.getLogger('partial-build')
  const report = {}

  this.once('playbookBuilt', async ({ playbook }) => {
    request = core.readRequest(process.env)
    const repo = playbook.dir
    lock = await core.acquireLock(repo)
    if (request.mode !== 'full') {
      try {
        baseDir = process.env.ANTORA_BUILD_BASELINE
          ? path.resolve(repo, process.env.ANTORA_BUILD_BASELINE)
          : JSON.parse(await fsp.readFile(path.join(repo, 'build/partial-build/latest.json'), 'utf8')).directory
        baseline = await core.readBaseline(baseDir)
      } catch (err) { baselineProblem = `Baseline unavailable: ${err.message}` }
    }
    output = core.newOutput(repo, process.env.ANTORA_BUILD_OUTPUT ||
      `build/partial-build/runs/${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`)
    destination = process.env.ANTORA_BUILD_OUTPUT ? output : path.resolve(repo, playbook.output.dir || 'build/site')
    if (!core.within(repo, destination) || destination === path.resolve(repo) ||
      (destination !== path.join(repo, 'wwwroot') && !core.within(path.join(repo, 'build'), destination))) {
      throw new Error('Default output must be wwwroot or a directory under build; use ANTORA_BUILD_OUTPUT for validation')
    }
    if (baseDir && (core.within(baseDir, output) || core.within(output, baseDir))) {
      throw new Error('Output and baseline must be separate directories, neither nested in the other')
    }
    core.committedOnly(playbook)
    signature = core.configurationSignature(playbook, repo)
    playbook.output = { dir: output, clean: false }
    this.require('@antora/logger').configure({ ...playbook.runtime.log, failureLevel: 'error' }, repo)
    const mapSite = this.getFunctions().mapSite
    const loadAsciiDoc = this.getFunctions().loadAsciiDoc
    const context = this
    this.replaceFunctions({ loadAsciiDoc (file, catalog, config) {
      let loading = true
      const tracked = catalog && core.trackIncludes(catalog, file, dependencies, uncertain, () => loading)
      try { return loadAsciiDoc(file, tracked, config) } finally { loading = false }
    }, mapSite (book, pages) {
      return mapSite(book, mode === 'partial' ? context.getVariables().contentCatalog.getPages((page) => page.pub) : pages)
    } })
    Object.assign(report, { requestedMode: request.mode, selected: [...request.targets], output: destination, staging: output })
    logger.warn(`Build requested: ${request.mode}; output: ${output}`)
  })

  this.once('contentAggregated', ({ contentAggregate }) => {
    aggregatedAt = performance.now()
    const origins = contentAggregate.flatMap((bucket) => bucket.origins)
    core.checkOrigins(origins)
    report.origins = origins.map(({ url, refname, reftype, refhash, startPath }) =>
      ({ url, refname, reftype, sha: refhash, startPath })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
  })

  this.once('contentClassified', ({ contentCatalog, siteAsciiDocConfig }) => {
    const files = contentCatalog.getFiles().filter((file) => file.src.origin?.type === 'git')
    const pages = contentCatalog.getPages((file) => file.out && file.src.origin?.type === 'git')
    report.sourcePages = pages.length
    const fxns = this.getFunctions()
    metadata = {}
    // Header loading supplies xref labels without converting page bodies.
    for (const file of pages) {
      const config = contentCatalog.getComponentVersion(file.src.component, file.src.version)?.asciidoc || siteAsciiDocConfig
      const value = fxns.extractAsciiDocMetadata(fxns.loadAsciiDoc(file, contentCatalog,
        { ...config, extensions: [], headerOnly: true }))
      file.asciidoc = value
      file.title = value.doctitle
      metadata[core.fileKey(file)] = { doctitle: value.doctitle, xreftext: value.xreftext,
        navtitle: value.navtitle, aliases: value.attributes?.['page-aliases'] || '' }
    }
    current = core.capture(contentCatalog, files, metadata, signature, report.origins)
    current.dependencies = core.serializeDependencies(dependencies)
    current.uncertain = [...uncertain]
    const decision = core.assess(request, current, baseline, baselineProblem)
    mode = decision.mode
    selected = (src) => request.targets.has(core.pair(src))
    report.effectiveMode = mode
    report.reasons = decision.reasons
    if (decision.reasons.length) logger.warn(`Full build required: ${decision.reasons.slice(0, 12).join('; ')}`)
    if (mode === 'partial') {
      // Retain the last completed parse's include edges for unconverted bodies.
      for (const [resource, consumers] of Object.entries(baseline.dependencies)) {
        for (const consumer of consumers) {
          if (!request.targets.has(baseline.files[consumer]?.pair)) (dependencies[resource] ||= new Set()).add(consumer)
        }
      }
      for (const consumer of baseline.uncertain || []) {
        if (!request.targets.has(baseline.files[consumer]?.pair)) uncertain.add(consumer)
      }
      for (const file of pages) {
        if (selected(file.src)) continue
        const aliases = file.asciidoc.attributes?.['page-aliases']
        if (aliases) aliases.split(',').map((it) => it.trim()).filter(Boolean)
          .forEach((spec) => contentCatalog.registerPageAlias(spec, file))
      }
      for (const file of files) if (!selected(file.src)) file.out = false
    }
  })

  this.once('documentsConverted', ({ contentCatalog }) => {
    convertedAt = performance.now()
    const pages = contentCatalog.getPages((file) => file.out)
    if (mode === 'partial' && pages.some((page) => !selected(page.src))) throw new Error('Converted page outside selection')
    report.convertedPages = pages.length
    report.suppressedPages = report.sourcePages - pages.length
  })

  this.once('navigationBuilt', ({ contentCatalog }) => {
    if (mode === 'partial') {
      core.mergeNavigation(contentCatalog, request.targets, baseline.navigation)
    }
    current.navigation = Object.fromEntries(contentCatalog.getComponents().flatMap((component) =>
      component.versions.map((version) => [core.pair({ component: component.name, version: version.version }), clone(version.navigation || [])])))
  })

  this.once('beforePublish', async ({ contentCatalog, siteCatalog }) => {
    if (root.failOnExit) throw new Error('Antora reported errors; no site or baseline will be published')
    const generated = contentCatalog.getPages((page) => page.out)
    if (generated.some((file) => /Unresolved (?:include )?directive|class="[^"]*\bunresolved\b/.test(file.contents.toString()))) {
      throw new Error('Unresolved include/xref in HTML; publication stopped')
    }
    current.dependencies = core.serializeDependencies(dependencies)
    current.uncertain = [...uncertain]
    if (mode === 'partial') {
      await core.copyBaseline(baseDir, output, baseline.inventory)
    } else await fsp.mkdir(output, { recursive: true })
    Object.assign(report, { aggregateSeconds: (aggregatedAt - started) / 1000,
      prepareAndConvertSeconds: (convertedAt - aggregatedAt) / 1000,
      elapsedBeforePublishSeconds: (performance.now() - started) / 1000,
      baseline: mode === 'partial' ? baseDir : null,
      contract: 'Complete local site. Replace the destination as a whole; no deployment is performed.' })
    siteCatalog.addFile({ contents: Buffer.from(JSON.stringify(report, null, 2) + '\n'),
      path: 'partial-build-report.json', out: { path: 'partial-build-report.json' }, pub: { url: '/partial-build-report.json' } })
    logger.warn(`Build ${mode}: converted ${report.convertedPages}/${report.sourcePages} pages`)
  })

  this.once('sitePublished', async ({ playbook }) => {
    if (root.failOnExit) throw new Error('Publication errors; baseline pointer not updated')
    current.inventory = await core.inventory(output)
    current.report = { ...report, totalSeconds: (performance.now() - started) / 1000 }
    await fsp.mkdir(path.join(output, '.partial-build'), { recursive: true })
    await fsp.writeFile(path.join(output, '.partial-build/state.json'), JSON.stringify(current) + '\n')
    if (destination !== output) await core.promote(output, destination, playbook.dir)
    const pointer = path.join(playbook.dir, 'build/partial-build/latest.json')
    await fsp.mkdir(path.dirname(pointer), { recursive: true })
    const temporary = `${pointer}.${randomUUID()}.tmp`
    await fsp.writeFile(temporary, JSON.stringify({ directory: destination }) + '\n')
    await fsp.rename(temporary, pointer)
    logger.warn(`Verified result: ${destination}; ${current.report.totalSeconds.toFixed(2)} s`)
  })

  this.once('contextClosed', async () => { if (lock) await lock.release() })
}
