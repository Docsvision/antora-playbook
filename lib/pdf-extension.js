"use strict";

const fsp = require("node:fs/promises");
const ospath = require("node:path");
const result = { command: null, targets: {} };

let lock = Promise.resolve();

// ref: https://docs.antora.org/assembler/latest/custom-exporter-extension/#example
module.exports.register = function ({ config }) {
  const converter = {
    convert,
    backend: "pdf",
    extname: ".pdf",
    mediaType: "application/pdf",
  };
  this.require("@antora/assembler").configure(this, converter, config);
  this.once("sitePublished", ({ playbook }) => {
    return generateMakefile(playbook);
  });
};

async function convert(file, convertAttributes, buildConfig) {
  const { cwd, command, qualifyExports } = buildConfig;

  if (qualifyExports) {
    convertAttributes["outfile"] = ospath.join(
      convertAttributes.outdir,
      file.assembler.downloadStem + convertAttributes.outfilesuffix
    );
  }

  for (const key in convertAttributes) {
    const val = convertAttributes[key];
    if (typeof val === "string" && ospath.isAbsolute(val)) {
      convertAttributes[key] = makeRelative(cwd, val);
    }
  }

  const argv = convertAttributes
    .toArgs("-a", command)
    .concat(
      "-B",
      convertAttributes.docdir,
      "-o",
      makeRelative(convertAttributes.docdir, convertAttributes.outfile),
      convertAttributes.docfile
    );

  await lock.then(() => {
    result.command ??= command;
    result.targets[convertAttributes.outfile] = argv;
  });

  lock = Promise.resolve();
}

function makeRelative(cwd, pathStr) {
  return ospath
    .relative(cwd, pathStr)
    .replaceAll(ospath.win32.sep, ospath.posix.sep);
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

  const outputFilePath = ospath.join(playbook.dir, "Makefile");
  await fsp.writeFile(outputFilePath, makefile.join("\n"));
}
