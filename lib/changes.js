"use strict";

const baseUrl = "https://help.docsvision.com";

const fs = require("fs/promises");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const path = require("path");

module.exports.register = function () {
  const sources = [];
  const changes = {};

  let deployed;
  let products;

  this.on("contextStarted", async ({ playbook }) => {
    const prodBuild = process.env.ANTORA_PROD_BUILD === "true";
    const siteUrl = playbook.site.url;

    if (!prodBuild) {
      console.log("Skipping: ANTORA_PROD_BUILD is not set to 'true'.");
      return;
    }

    if (!siteUrl.startsWith("/")) {
      console.log("Skipping: site.url is not a relative URL.");
      return;
    }

    if (siteUrl.endsWith("/")) {
      console.log("Skipping: site.url should not end with a '/'.");
      return;
    }

    const deployedResp = await fetch(`${baseUrl}${siteUrl}/build.json`);
    if (!deployedResp.ok) {
      console.log(`Skipping: failed to fetch ${deployedResp.url}`);
      return;
    }
    deployed = await deployedResp.json();

    const productsResp = await fetch(`${baseUrl}/api/changelog/products`);
    if (!productsResp.ok) {
      console.log(`Skipping: failed to fetch ${productsResp.url}`);
      return;
    }
    products = await productsResp.json();
  });

  this.on("contentAggregated", async ({ playbook, contentAggregate }) => {
    const label = "Time spent calculating changes";
    console.time(label);

    for (const content of contentAggregate) {
      for (const origin of content.origins) {
        const currentSource = {
          name: content.name,
          version: content.version,
          url: origin.url,
          branch: origin.branch,
          refhash: origin.refhash,
        };

        sources.push(currentSource);

        //
        // check source
        //

        if (!products || !deployed) {
          continue;
        }

        const product = products.find(
          (item) =>
            item.alias === currentSource.name &&
            item.version === currentSource.version
        );

        if (!product) {
          continue;
        }

        const prevSource = deployed.sources.find(
          (item) =>
            item.name === currentSource.name &&
            item.version === currentSource.version &&
            item.branch === currentSource.branch
        );

        if (!prevSource) {
          continue;
        }

        //
        // fetch changes
        //

        await git.fetch({
          fs,
          http,
          gitdir: origin.gitdir,
          remote: "origin",
          singleBranch: true,
          ref: currentSource.branch,
          since: deployed.date,
        });

        const commits = await git.log({
          fs,
          gitdir: origin.gitdir,
          ref: `refs/remotes/origin/${currentSource.branch}`,
          since: deployed.date,
        });

        //
        // collect issues
        //

        const issues = new Set();

        for (const commit of commits) {
          if (commit.oid === prevSource.refhash) {
            break;
          }

          const matches = commit.commit.message.match(/(ERR|GBL|TSK)-[0-9]+/g);
          if (matches) {
            for (const match of matches) {
              issues.add(match);
            }
          }
        }

        if (issues.size > 0) {
          changes[product.id] = Array.from(issues);
        }
      }
    }

    const changesPath = path.join(playbook.dir, "changes.json");
    await fs.writeFile(changesPath, JSON.stringify(changes));

    console.timeEnd(label);
  });

  this.on("sitePublished", async ({ playbook }) => {
    const buildPath = path.join(playbook.output.dir, "build.json");
    const buildData = { date: Date.now(), sources };
    await fs.writeFile(buildPath, JSON.stringify(buildData));
  });
};
