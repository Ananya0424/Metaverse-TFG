const fs = require('fs');

const wasmBuffer = fs.readFileSync('public/webgl/Build/TFGWeb(20-02-26).wasm');
const wasmString = wasmBuffer.toString('latin1');

const index = wasmString.indexOf('ModuleApiResponse');
if (index !== -1) {
    const snippet = wasmString.substring(Math.max(0, index - 200), Math.min(wasmString.length, index + 200));
    console.log(snippet.replace(/[^\x20-\x7E]/g, '.'));
} else {
    console.log("Not found");
}
