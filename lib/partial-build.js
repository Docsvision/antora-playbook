'use strict'

// Experimental component/version build. Dependencies supply source for includes,
// while Atlas supplies references to component versions outside this build.
const fs = require('node:fs')
const path = require('node:path')

module.exports.register = function ({ config }) {
  const logger = this.getLogger('partial-build')
  let baseline
  let manifestPath
  let stats
  const selected = (src) => src.component === config.component && src.version === String(config.version)

  this.once('playbookBuilt', ({ playbook }) => {
    manifestPath = path.resolve(playbook.dir, config.manifest || './wwwroot/site-manifest.json')
    baseline = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    if (!baseline.components?.[config.component]?.versions?.[config.version]) {
      throw new Error('Partial build requires this component/version in a previous full site manifest')
    }
    if (baseline.url !== playbook.site.url) throw new Error('Baseline and partial build must have the same site.url')
    playbook.content.sources = [
      { url: config.source, branches: [config.refname], tags: [] },
      ...(config.dependencies || []).map((source) => ({ ...source, tags: [] })),
    ]
    playbook.asciidoc.attributes['primary-site-manifest-url'] = manifestPath
    playbook.asciidoc.attributes['primary-site-url'] = '.'
    playbook.output.dir = './build/partial-site'
    playbook.runtime.fetch = false
    logger.info(`Building ${config.version}@${config.component}; output: build/partial-site`)
  })

  this.once('contentClassified', ({ contentCatalog }) => {
    const componentVersion = contentCatalog.getComponentVersion(config.component, String(config.version))
    if (!componentVersion || Array.from(componentVersion.origins).every((origin) => origin.type === 'manifest')) {
      throw new Error('Selected source did not provide the requested component/version')
    }
    const prior = baseline.components[config.component].versions[config.version]
    if (Boolean(componentVersion.prerelease) !== Boolean(prior.prerelease)) {
      throw new Error('Prerelease status changed; a full build is required')
    }
    stats = { component: config.component, version: String(config.version), sourcePages: 0,
      importedPages: 0, suppressedPages: 0, convertedPages: 0, baseline: manifestPath }
    for (const file of contentCatalog.getFiles()) {
      if (file.src.family === 'page') {
        if (file.src.origin?.type === 'manifest') stats.importedPages++
        else stats.sourcePages++
      }
      if (selected(file.src)) continue
      if (file.src.family === 'page' && file.src.origin?.type !== 'manifest') {
        // Keep source contents available to include::, and published titles for xref:.
        const entry = baseline.components[file.src.component]?.versions?.[file.src.version]?.pages
          .find((page) => (page.module || 'ROOT') === file.src.module && page.path === file.src.relative && !page.alias)
        if (entry) {
          file.title = entry.title
          file.asciidoc = { doctitle: entry.title, xreftext: entry.xreftext || entry.title,
            navtitle: entry.navtitle || entry.xreftext || entry.title }
        }
        stats.suppressedPages++
      }
      // pub remains intact for references; out controls conversion and publication.
      file.out = false
    }
    logger.info(JSON.stringify(stats))
  })

  this.once('documentsConverted', ({ contentCatalog }) => {
    const pages = contentCatalog.getPages((page) => page.out)
    if (!pages.length || pages.some((page) => !selected(page.src))) {
      throw new Error('Partial build did not restrict conversion to the selected component/version')
    }
    stats.convertedPages = pages.length
    logger.info(`Converted ${pages.length} pages, all in ${config.version}@${config.component}`)
  })

  this.once('beforePublish', ({ siteCatalog }) => {
    siteCatalog.addFile({ contents: Buffer.from(JSON.stringify(stats, null, 2) + '\n'),
      path: 'partial-build-report.json', out: { path: 'partial-build-report.json' },
      pub: { url: '/partial-build-report.json' } })
  })
}
