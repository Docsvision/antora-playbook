'use strict'

const convertDocumentToDocx = require('./convert-document-to-docx')
const { assembleContent } = require('@antora/assembler')

module.exports.register = function () {
  this.on('contentClassified', ({ contentCatalog }) => {
    contentCatalog.getPages((page) => {
      if (!page.out) return
      page.src.contents = page.contents
      page.src = new Proxy(page.src, { deleteProperty: (o, p) => (p === 'contents' ? true : delete o[p]) })
    })
  })
  this.on('beforePublish', ({ playbook, contentCatalog, siteCatalog }) =>
    assembleContent.call(this, playbook, contentCatalog, convertDocumentToDocx, { siteCatalog })
  )
}