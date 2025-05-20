#!/usr/bin/env node
import fs from "fs";
import path from "path";
import axios from "axios";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage("Usage: $0 add <user>/<slug> [output]")
    .option("base-url", {
      alias: "b",
      describe: "Base URL of the API of SnippetLab",
      type: "string",
      default: "https://snippetlab.app",
    })
    .command(
      "add <userSlug> [output]",
      "Download the snippet identified by user/slug",
      (y) => {
        y.positional("userSlug", {
          describe: "Snippet identifier in the format user/slug",
          type: "string",
        });
        y.positional("output", {
          describe: "Optional output file path",
          type: "string",
          default: null,
        });
      }
    )
    .demandCommand(1)
    .help().argv;

  const BASE_URL = argv.baseUrl || process.env.SNIPPETLAB_BASE_URL;

  const [cmd] = argv._;
  if (cmd !== "add") {
    console.error("Unsupported command:", cmd);
    process.exit(1);
  }

  const [user, slug] = argv.userSlug.split("/");
  if (!user || !slug) {
    console.error("Invalid format. Use: user/slug");
    process.exit(1);
  }

  const url = `${BASE_URL}/api/snippets/${encodeURIComponent(
    user
  )}/${encodeURIComponent(slug)}`;

  try {
    const response = await axios.get(url, { responseType: "stream" });

    const isRedirected = !process.stdout.isTTY;

    let outputPath = argv.output;

    if (!outputPath && !isRedirected) {
      const cd = response.headers["content-disposition"];
      if (cd) {
        const match = cd.match(/filename="?([^";]+)"?/);
        if (match) {
          outputPath = match[1];
        }
      }
    }

    if (outputPath) {
      const fullPath = path.resolve(process.cwd(), outputPath);
      const dir = path.dirname(fullPath);
      fs.mkdirSync(dir, { recursive: true });

      const writer = fs.createWriteStream(fullPath);
      response.data.pipe(writer);
      writer.on("finish", () => {
        console.error(`Snippet saved to ${outputPath}`);
      });
      writer.on("error", (err) => {
        console.error("Error writing file:", err.message);
        process.exit(1);
      });
    } else {
      response.data.pipe(process.stdout);
    }
  } catch (err) {
    console.error(
      `Error downloading ${url}:`,
      err.response?.statusText || err.message
    );
    process.exit(1);
  }
}

main();
