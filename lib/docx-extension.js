"use strict";

const fsp = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

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
  const intermediateFormat = buildConfig.intermediateFormat || "docbook";
  if (!["docbook", "fodt"].includes(intermediateFormat)) {
    throw new Error("DOCX build.intermediate_format must be docbook or fodt");
  }
  if (intermediateFormat === "fodt") {
    if (/\basciidoctor\s+-b\s+docbook5(?:\s|$)/.test(command)) {
      throw new Error("FODT requires build.command with an Asciidoctor FODT backend (for example, asciidoctor-packt)");
    }
    if (buildConfig.referenceDoc) {
      throw new Error("build.reference_doc applies to the DocBook/Pandoc route; style FODT using its templates");
    }
  }

  if (qualifyExports) {
    attributes.outfile = path.join(attributes.outdir, file.assembler.downloadStem + ".docx");
  }
  const outfile = attributes.outfile;
  const outdir = path.dirname(outfile);
  await fsp.mkdir(outdir, { recursive: true });
  // A fresh temporary output prevents a failed conversion from publishing an old DOCX.
  const temporaryDir = await fsp.mkdtemp(path.join(outdir, ".docx-"));
  const intermediateFile = path.join(temporaryDir, intermediateFormat === "fodt" ? "source.fodt" : "source.xml");
  const docxFile = path.join(temporaryDir, intermediateFormat === "fodt" ? "source.docx" : "output.docx");

  try {
    attributes.outfile = intermediateFile;
    const args = attributes.toArgs("-a", "-o").concat("-B", attributes.docdir, "-");
    const firstResult = await runCommand(command, args, {
      parse: true,
      cwd,
      stdin: file.contents,
      stdout: "ignore",
      stderr,
    });
    attributes.outfile = outfile;

    let result;
    if (intermediateFormat === "fodt") {
      // LibreOffice processes must not share a user profile during parallel exports.
      const profile = pathToFileURL(path.join(temporaryDir, "libreoffice-profile")).href;
      result = await runCommand(buildConfig.libreofficeCommand || "soffice", [
        "-env:UserInstallation=" + profile,
        "--headless", "--convert-to", "docx:Office Open XML Text",
        "--outdir", temporaryDir, intermediateFile,
      ], { parse: true, cwd: attributes.docdir, stdout: "ignore", stderr });
    } else {
      const pandocArgs = [
        "--from=docbook", "--to=docx", "--standalone",
        "--resource-path", attributes.docdir,
        "--output", docxFile, intermediateFile,
      ];
      if (buildConfig.referenceDoc) {
        pandocArgs.push("--reference-doc", path.resolve(cwd, buildConfig.referenceDoc));
      }
      result = await runCommand(buildConfig.pandocCommand || "pandoc", pandocArgs, {
        parse: true,
        cwd: attributes.docdir,
        stdout: "ignore",
        stderr,
      });
    }
    if (!(await fsp.stat(docxFile)).size) throw new Error("DOCX converter produced an empty document: " + outfile);
    await fsp.rename(docxFile, outfile);
    if (stderr === "buffer") {
      result.stderr = Buffer.concat([firstResult.stderr || Buffer.alloc(0), result.stderr || Buffer.alloc(0)]);
    }
    return result;
  } finally {
    attributes.outfile = outfile;
    await fsp.rm(temporaryDir, { recursive: true, force: true });
  }
}
