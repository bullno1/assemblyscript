import path from "path";
import fs from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pkg = require("../package-lock.json");

const mainVersion = pkg.version;
const binaryenVersion = pkg.dependencies.binaryen.version;
const longVersion = pkg.dependencies.long.version;

const distUrl = mainVersion === "0.0.0" ? `./` : `https://cdn.jsdelivr.net/npm/assemblyscript@${mainVersion}/dist/`;
const binaryenUrl = `https://cdn.jsdelivr.net/npm/binaryen@${binaryenVersion}/index.js`;
const longUrl = `https://cdn.jsdelivr.net/npm/long@${longVersion}/index.js`;
const importmap = {
  "imports": {
    "assemblyscript": `${distUrl}assemblyscript.js`,
    "assemblyscript/asc": `${distUrl}asc.js`,
    "binaryen": binaryenUrl,
    "long": longUrl
  }
};

fs.writeFileSync(path.join(dirname, "..", "dist", "importmap.json"), `${JSON.stringify(importmap, null, 2)}
`);
fs.writeFileSync(path.join(dirname, "..", "dist", "importmap.js"), `export const importmap = ${JSON.stringify(importmap, null, 2)}
export default importmap;
`);
fs.writeFileSync(path.join(dirname, "..", "dist", "web.html"), `<script async src="https://cdn.jsdelivr.net/npm/es-module-shims@1/dist/es-module-shims.js"></script>
<script type="importmap">
${JSON.stringify(importmap, null, 2)}
</script>
<script type="module">
import asc from "assemblyscript/asc";

const files = {
  "index.ts": "export function add(a: i32, b: i32): i32 { return a + b; }"
};

const { error, stdout } = await asc.main([
  "index.ts", "--textFile", "--optimize"
], {
  readFile(name, baseDir) {
    if (Object.prototype.hasOwnProperty.call(files, name)) return files[name];
    return null;
  },
  writeFile(name, data, baseDir) {
  },
  listFiles(dirname, baseDir) {
    return [];
  }
});

if (error) throw error;
console.log(stdout.toString());
</script>
`);
