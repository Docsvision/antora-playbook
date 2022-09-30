'use strict'

module.exports.register = function () {
  this.once('playbookBuilt', ({ playbook }) => {
    if (playbook.site.url === 'https://doc-online-vdv.digdes.com/') return
    playbook.content.sources = playbook.content.sources
      .filter(({ url }) => url !== 'https://github.com/Docsvision/Solution-Manager-Antora.git')
    this.updateVariables({ playbook })
  })
}