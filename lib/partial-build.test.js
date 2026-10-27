'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const core = require('./partial-build-core')
const copy = (value) => JSON.parse(JSON.stringify(value))
const file = (pair, hash = 'a', family = 'page') => ({ pair, hash, family, metadata: { doctitle: 'Title' } })
const base = () => ({ schema: core.SCHEMA, signature: 'same', components: { '6.1@ai': {}, '6.1@platform': {} },
  files: { ai: file('6.1@ai'), shared: file('6.1@platform', 'x', 'partial') },
  navigation: { '6.1@ai': [{ content: 'AI' }], '6.1@platform': [{ content: 'Platform' }] },
  dependencies: {}, uncertain: [], origins: [{ sha: 'a'.repeat(40) }] })
const request = (mode = 'partial', targets = ['6.1@ai']) => ({ mode, targets: new Set(targets) })

test('CLI contract: full default, several targets, explicit errors', () => {
  assert.equal(core.readRequest({}).mode, 'full')
  assert.deepEqual([...core.readRequest({ ANTORA_BUILD_MODE: 'partial', ANTORA_BUILD_TARGETS: '6.1@ai, _@ROOT' }).targets], ['6.1@ai', '_@ROOT'])
  for (const env of [ { ANTORA_BUILD_MODE: '' }, { ANTORA_BUILD_MODE: 'incremental' },
    { ANTORA_BUILD_MODE: 'partial' }, { ANTORA_BUILD_TARGETS: '6.1@ai' },
    { ANTORA_BUILD_MODE: 'partial', ANTORA_BUILD_TARGETS: '6.1@ai,6.1@ai' },
    { ANTORA_BUILD_MODE: 'auto', ANTORA_BUILD_TARGETS: 'bad' }, { ANTORA_BUILD_OUTPUT: '' } ]) {
    assert.throws(() => core.readRequest(env))
  }
})

test('partial/full/auto distinguish unknown targets and missing baseline', () => {
  assert.equal(core.assess(request(), base(), base()).mode, 'partial')
  assert.equal(core.assess(request('full', []), base()).mode, 'full')
  assert.throws(() => core.assess(request(), base()), /No baseline/)
  assert.equal(core.assess(request('auto'), base()).mode, 'full')
  assert.throws(() => core.assess(request('auto', ['7@missing']), base(), base()), /Unknown/)
})

test('body edits and new pages/nav in selected component stay partial', () => {
  const before = base(), after = copy(before)
  after.files.ai.hash = 'new body'
  after.files.added = file('6.1@ai', 'new page')
  after.files.nav = file('6.1@ai', 'updated nav', 'nav')
  after.origins[0].sha = 'b'.repeat(40)
  assert.equal(core.assess(request(), after, before).mode, 'partial')
})

test('shared includes traverse nested and cyclic consumers; larger selection is safe', () => {
  const before = base()
  before.files.helper = file('6.1@ai', 'helper', 'partial')
  before.dependencies = { helper: ['shared'], shared: ['ai', 'helper'] }
  const after = copy(before)
  after.files.helper.hash = 'changed helper'
  assert.throws(() => core.assess(request(), after, before), /Include consumer/)
  assert.equal(core.assess(request('auto'), after, before).mode, 'full')
  assert.equal(core.assess(request('partial', ['6.1@ai', '6.1@platform']), after, before).mode, 'partial')
})

test('new versions, metadata, removals, global settings require full', () => {
  for (const mutate of [
    (state) => { state.components['6.2@ai'] = {} },
    (state) => { state.components['6.1@ai'].prerelease = true },
    (state) => { state.signature = 'new UI' },
    (state) => { delete state.files.ai },
    (state) => { state.files.ai.hash = 'new'; state.files.ai.metadata.doctitle = 'New title' },
    (state) => { state.files.shared.hash = 'changed outside selection' },
  ]) {
    const before = base(), after = copy(before)
    mutate(after)
    assert.throws(() => core.assess(request(), after, before), /Partial build refused/)
    assert.equal(core.assess(request('auto'), after, before).mode, 'full')
  }
})

test('ambiguous includes are conservative barriers and snapshots must have nav', () => {
  const before = base(), after = copy(before)
  before.uncertain = ['shared']
  after.files.ai.hash = 'changed'
  assert.throws(() => core.assess(request(), after, before), /dynamic include/)
  delete before.navigation
  assert.throws(() => core.assess(request(), after, before), /Navigation snapshot/)
})

test('content fingerprints ignore origin working-tree paths and record committed endpoints', () => {
  const before = base(), after = copy(before)
  // No working-tree or index data is part of the decision input.
  after.origins[0].sha = 'c'.repeat(40)
  assert.equal(core.assess(request(), after, before).mode, 'partial')
  assert.equal(core.pair({ component: 'ROOT', version: '' }), '_@ROOT')
})

test('baseline tampering and unsafe/reused output paths are rejected', async () => {
  const repo = path.resolve(__dirname, '..')
  assert.throws(() => core.newOutput(repo, '../outside'), /under/)
  assert.throws(() => core.newOutput(repo, 'wwwroot'), /under/)
  const dir = await fs.mkdtemp(path.join(repo, 'build/partial-build-tests-'))
  assert.throws(() => core.newOutput(repo, dir), /already exists/)
  await fs.writeFile(path.join(dir, 'page.html'), 'valid')
  const inventory = await core.inventory(dir)
  await core.verifyInventory(dir, inventory)
  await fs.writeFile(path.join(dir, 'page.html'), 'tampered')
  await assert.rejects(core.verifyInventory(dir, inventory), /changed/)
})

test('worktree opt-in is overridden at every source and origin SHA is enforced', () => {
  const book = { content: { worktrees: true, sources: [{ url: '.', worktrees: true, startPaths: ['a', 'b'] }] } }
  core.committedOnly(book)
  assert.equal(book.content.worktrees, false)
  assert.equal(book.content.sources[0].worktrees, false)
  assert.deepEqual(book.content.sources[0].startPaths, ['a', 'b'])
  core.checkOrigins([{ refhash: 'd'.repeat(40), worktree: false }])
  for (const origins of [[], [{}], [{ refhash: 'd'.repeat(40), worktree: 'dirty' }]]) assert.throws(() => core.checkOrigins(origins), /Committed Git/)
})

test('navigation merge accepts a new page and preserves other versions exactly', () => {
  const ai = { version: '6.1', navigation: [{ content: 'New page', url: '/ai/new/' }] }
  const platform = { version: '6.1', navigation: [{ content: 'Rebuilt but not selected' }] }
  const previous = { '6.1@ai': [{ content: 'Old page' }], '6.1@platform': [{ content: 'Kept', items: [{ content: 'Child' }] }] }
  core.mergeNavigation({ getComponents: () => [{ name: 'ai', versions: [ai] }, { name: 'platform', versions: [platform] }] }, new Set(['6.1@ai']), previous)
  assert.equal(ai.navigation[0].content, 'New page')
  assert.deepEqual(platform.navigation, previous['6.1@platform'])
  assert.notEqual(platform.navigation, previous['6.1@platform'])
})

test('include tracking records resolved nested resources, not conversion-time xrefs', () => {
  const outer = { src: { component: 'ai', version: '6.1', module: 'ROOT', family: 'page', relative: 'index.adoc' } }
  const partial = { src: { component: 'platform', version: '6.1', module: 'ROOT', family: 'partial', relative: 'shared.adoc' } }
  const edges = {}, uncertain = new Set()
  let loading = true
  const tracked = core.trackIncludes({ resolveResource: (name) => name === 'known' ? partial : undefined,
    getByPath: () => partial }, outer, edges, uncertain, () => loading)
  tracked.resolveResource('known')
  tracked.getByPath({})
  assert.deepEqual(core.serializeDependencies(edges), { '6.1@platform:ROOT:partial:shared.adoc': ['6.1@ai:ROOT:page:index.adoc'] })
  tracked.resolveResource('missing-optional')
  assert.deepEqual([...uncertain], ['6.1@ai:ROOT:page:index.adoc'])
  loading = false
  tracked.resolveResource('missing-xref')
  assert.equal(uncertain.size, 1)
})

test('installed Antora resolves nested, tagged, conditional and attributed includes through tracker', () => {
  const Catalog = require(path.join(path.dirname(require.resolve('@antora/content-classifier')), 'content-catalog'))
  const load = require('@antora/asciidoc-loader')
  const catalog = new Catalog({ site: {} })
  for (const name of ['ai', 'platform']) catalog.registerComponentVersion(name, '6.1', { asciidoc: { attributes: {} } })
  function add (component, family, relative, contents) {
    return catalog.addFile({ src: { component, version: '6.1', module: 'ROOT', family, relative,
      path: `modules/ROOT/${family}s/${relative}` }, contents })
  }
  const page = add('ai', 'page', 'index.adoc', '= Test\n:target: shared.adoc\n\ninclude::6.1@platform:ROOT:partial${target}[tag=body]\n\nifdef::disabled[]\ninclude::missing.adoc[]\nendif::[]\n')
  add('platform', 'partial', 'shared.adoc', '// tag::body[]\nIncluded body.\n\ninclude::nested.adoc[]\n// end::body[]\n')
  add('platform', 'partial', 'nested.adoc', 'Nested body.\n')
  const edges = {}, uncertain = new Set()
  let loading = true
  const doc = load(page, core.trackIncludes(catalog, page, edges, uncertain, () => loading), {})
  loading = false
  const html = doc.convert()
  assert.match(html, /Included body/)
  assert.match(html, /Nested body/)
  assert.equal(Object.keys(edges).length, 2)
  assert.equal(uncertain.size, 0)
})

test('completed output replacement retains a backup and drops stale files', async () => {
  const repo = path.resolve(__dirname, '..')
  const root = await fs.mkdtemp(path.join(repo, 'build/partial-build-promotion-test-'))
  const old = path.join(root, 'site'), fresh = path.join(root, 'new')
  await fs.mkdir(old); await fs.mkdir(fresh)
  await fs.writeFile(path.join(old, 'deleted.html'), 'old')
  await fs.writeFile(path.join(fresh, 'new.html'), 'new')
  await core.promote(fresh, old, repo)
  assert.deepEqual(await fs.readdir(old), ['new.html'])
  assert.equal(await fs.readFile(path.join(old, 'new.html'), 'utf8'), 'new')
  await assert.rejects(core.promote(old, path.join(old, 'nested'), repo), /Unsafe/)
})

test('partial materialization copies verified baseline into a new directory and excludes state', async () => {
  const repo = path.resolve(__dirname, '..')
  const root = await fs.mkdtemp(path.join(repo, 'build/partial-build-copy-test-'))
  const source = path.join(root, 'baseline'), output = path.join(root, 'new-parent', 'result')
  await fs.mkdir(path.join(source, '.partial-build'), { recursive: true })
  await fs.mkdir(path.join(source, 'other'), { recursive: true })
  await fs.writeFile(path.join(source, 'other', 'kept.html'), 'unchanged')
  await fs.writeFile(path.join(source, '.partial-build', 'state.json'), '{}')
  const expected = await core.inventory(source)
  await core.copyBaseline(source, output, expected)
  assert.deepEqual(await core.inventory(output), expected)
  assert.deepEqual(await fs.readdir(output), ['other'])
  await assert.rejects(core.copyBaseline(source, output, expected), /EEXIST/)
  await fs.writeFile(path.join(source, 'other', 'kept.html'), 'tampered')
  await assert.rejects(core.copyBaseline(source, path.join(root, 'bad'), expected), /changed during copying/)
})
