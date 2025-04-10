import * as esbuild from "esbuild";
import path from "node:path";
import fs from "node:fs";
import { platform } from "node:process";

const entry = "./src/index.ts";

let jsEntry = path.resolve(
  "dist/node",
  path.basename(entry).replace(".ts", ".js")
);
let outfile = jsEntry.replace(".js", ".cjs");


// Function to copy directory recursively
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read all files/directories in the source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy Prisma client files from src to dist
const prismaSrcDir = "./src/prisma";
const prismaDestDir1 = "./dist/node/prisma";
const prismaDestDir2 = "./dist/web/prisma";

if (fs.existsSync(prismaSrcDir)) {
  console.log(`Copying Prisma client files from ${prismaSrcDir} to ${prismaDestDir1}...`);
  copyDir(prismaSrcDir, prismaDestDir1);
  console.log(`Copying Prisma client files from ${prismaSrcDir} to ${prismaDestDir2}...`);
  copyDir(prismaSrcDir, prismaDestDir2);
  console.log("Prisma client files copied successfully.");
} else {
  console.warn(`Prisma client directory ${prismaSrcDir} not found.`);
}



await esbuild.build({
  entryPoints: ["./dist/node/index.js"],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "es2021",
  resolveExtensions: [".node.js", ".ts", ".js"],
  allowOverwrite: true,
  plugins: [makeNodeModulesExternal(), makeJsooExternal()],
  allowOverwrite: true,
  outfile,
  dropLabels: ["ESM"],
  minify: false,
});

function makeNodeModulesExternal() {
  let isNodeModule = /^[^./\\]|^\.[^./\\]|^\.\.[^/\\]/;
  return {
    name: "plugin-external",
    setup(build) {
      build.onResolve({ filter: isNodeModule }, ({ path }) => ({
        path,
        external: !(platform === "win32" && path.endsWith("index.js")),
      }));
    },
  };
}

function makeJsooExternal() {
  let isJsoo = /(bc.cjs|plonk_wasm.cjs)$/;
  return {
    name: "plugin-external",
    setup(build) {
      build.onResolve({ filter: isJsoo }, ({ path: filePath, resolveDir }) => ({
        path:
          "./" +
          path.relative(
            path.resolve(".", "dist/node"),
            path.resolve(resolveDir, filePath)
          ),
        external: true,
      }));
    },
  };
}

