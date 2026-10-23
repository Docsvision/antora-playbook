"use strict";

const fsp = require("node:fs/promises");
const path = require("node:path");

// Based on the DocBook to DOCX example in the Assembler documentation.
// Both conversion commands run during Antora's assembly stage.
module.exports.register = function ({ config = {} }) {
  const converter = {
    backend: "docx",
    extname: ".docx",
    mediaType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xmlCompliant: true,
    getDefaultCommand,
    convert,
  };
  this.require("@antora/assembler", { require }).configure(this, converter, {
    configFile: "./antora-assembler-docx.yml",
    ...config,
  });
};

async function getDefaultCommand(cwd) {
  const command = "asciidoctor -b docbook5";
  return fsp.access(path.join(cwd, "Gemfile.lock")).then(
    () => "bundle exec " + command,
    () => command
  );
}

async function convert(file, attributes, buildConfig, { runCommand }) {
  const { command, cwd = process.cwd(), stderr = "print", qualifyExports } = buildConfig;
  if (!command) return null;

  if (qualifyExports) {
    attributes.outfile = path.join(attributes.outdir, file.assembler.downloadStem + ".docx");
  }
  const outfile = attributes.outfile;
  const outdir = path.dirname(outfile);
  await fsp.mkdir(outdir, { recursive: true });
  // A fresh temporary output prevents a failed conversion from publishing an old DOCX.
  const temporaryDir = await fsp.mkdtemp(path.join(outdir, ".docx-"));
  const docbookFile = path.join(temporaryDir, "source.xml");
  const docxFile = path.join(temporaryDir, "output.docx");

  try {
    attributes.outfile = docbookFile;
    const args = attributes.toArgs("-a", "-o").concat("-B", attributes.docdir, "-");
    const docbookResult = await runCommand(command, args, {
      parse: true,
      cwd,
      stdin: file.contents,
      stdout: "ignore",
      stderr,
    });
    attributes.outfile = outfile;

    const pandocArgs = [
      "--from=docbook", "--to=docx", "--standalone",
      "--resource-path", attributes.docdir,
      "--output", docxFile, docbookFile,
    ];
    if (buildConfig.referenceDoc) {
      pandocArgs.push("--reference-doc", path.resolve(cwd, buildConfig.referenceDoc));
    }
    const result = await runCommand(buildConfig.pandocCommand || "pandoc", pandocArgs, {
      parse: true,
      cwd: attributes.docdir,
      stdout: "ignore",
      stderr,
    });
    if (!(await fsp.stat(docxFile)).size) throw new Error("Pandoc produced an empty DOCX: " + outfile);
    await fsp.rename(docxFile, outfile);
    if (stderr === "buffer") {
      result.stderr = Buffer.concat([docbookResult.stderr || Buffer.alloc(0), result.stderr || Buffer.alloc(0)]);
    }
    return result;
  } finally {
    attributes.outfile = outfile;
    await fsp.rm(temporaryDir, { recursive: true, force: true });
  }
}
