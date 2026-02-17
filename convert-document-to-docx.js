'use strict'

const { runCommand } = require('@antora/assembler')
const ospath = require('node:path')

function convertDocumentToDocx (doc, buildConfig) {
  const {
    asciidoc: { attributes: baseAttributes } = { attributes: {} },
    contents: input,
    src: { component, version, basename, extname: docfilesuffix },
  } = doc
  const { command, cwd, dir } = buildConfig
  const docfile = `${version}@${component}::docx$${basename}`
  const docname = basename.substr(0, basename.length - docfilesuffix.length)
  const convertAttributes = Object.assign({}, baseAttributes, {
    docfile,
    docfilesuffix,
    'docname@': docname,
    imagesdir: dir,
  })
  Object.assign(doc, { contents: null, extname: '.docx', mediaType: 'application/msword' })
  const argv = Object.entries(convertAttributes).reduce(
    (accum, [name, val]) =>
      accum.push('-a', val ? `${name}=${val}` : val === '' ? name : `!${name}${val === false ? '=@' : ''}`) && accum,
    []
  )
  const output = ospath.join(dir, doc.path)
  argv.push('-o', output)
  return runCommand(command, argv, { cwd, input, output }).then((contents) =>
    Object.assign(doc, { contents, out: { path: doc.path } })
  )
}

module.exports = convertDocumentToDocx