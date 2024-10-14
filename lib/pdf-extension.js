"use strict";

const fs = require("fs/promises");
const path = require("path");
const result = { command: null, targets: {} };

let lock = Promise.resolve();

module.exports.register = function ({ config: { configFile: configSource } }) {
  this.once("beforeProcess", ({ siteAsciiDocConfig }) => {
    siteAsciiDocConfig.keepSource = true;
  });
  this.once("navigationBuilt", ({ playbook, contentCatalog, siteCatalog }) => {
    const { assembleContent } = this.require("@antora/assembler");
    return assembleContent.call(this, playbook, contentCatalog, convertDocumentToPdf, { siteCatalog, configSource });
  });
  this.once("sitePublished", ({ playbook }) => {
    return generateMakefile(playbook);
  });
};

async function convertDocumentToPdf(doc, buildConfig) {
  // based on @antora/pdf-extension/lib/convert-document-to-pdf.js
  const argv = Object.entries({
    ...doc.asciidoc.attributes,
    docfile: `${doc.src.version}@${doc.src.component}::pdf$${doc.src.basename}`,
    docfilesuffix: doc.src.extname,
    "docname@": doc.src.stem,
  }).flatMap(([name, val]) => 
    ["-a", val ? `${name}=${val}` : val === "" ? name : `!${name}${val === false ? "=@" : ""}`]
  );

  const output = path
    .format({
      dir: path.dirname(doc.out.path),
      name: doc.src.stem,
      ext: ".pdf",
    })
    .replace(/^\.[\/\\]/, "")
    .replaceAll(path.win32.sep, path.posix.sep);

  const build = path
    .relative(buildConfig.cwd, buildConfig.dir)
    .replaceAll(path.win32.sep, path.posix.sep);
  const input = path
    .join(build, doc.out.path)
    .replaceAll(path.win32.sep, path.posix.sep);

  argv.push("-B", build, "-o", output, input);

  await lock.then(() => {
    result.command ??= buildConfig.command;
    result.targets[output] = argv;
  });

  lock = Promise.resolve();
}

async function generateMakefile(playbook) {
  const makefile = [`COMMAND := ${result.command}\n`];

  const targets = Object.keys(result.targets).join(" ");
  makefile.push(`all: ${targets}\n`);

  for (const [target, argv] of Object.entries(result.targets)) {
    const args = argv
      .map((arg) =>
        arg.replace(/^/, "'").replace(/$/, "'").replace("$", "$$$$")
      )
      .join(" ");
    makefile.push(`${target}:`);
    makefile.push(`\t$(COMMAND) ${args}\n`);
  }

  const outputFilePath = path.join(playbook.dir, "Makefile");
  await fs.writeFile(outputFilePath, makefile.join("\n"));
}
