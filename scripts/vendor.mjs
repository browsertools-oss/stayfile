// Copies LGPL libheif-js into public/vendor unmodified, so it ships as its own file with its license.
import { mkdirSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('node_modules/libheif-js/package.json', 'utf8'));
const dir = `public/vendor/libheif/${pkg.version}`;
mkdirSync(dir, { recursive: true });
copyFileSync('node_modules/libheif-js/libheif-wasm/libheif-bundle.mjs', `${dir}/libheif-bundle.mjs`);
copyFileSync('node_modules/libheif-js/libheif-wasm/LICENSE', `${dir}/LICENSE`);
writeFileSync(
  `${dir}/NOTICE.txt`,
  `libheif-bundle.mjs is libheif-js ${pkg.version} (https://github.com/catdad-experiments/libheif-js),\n` +
    `an unmodified Emscripten build of libheif (https://github.com/strukturag/libheif).\n` +
    `It is licensed under the GNU Lesser General Public License v3.0; see LICENSE in this folder.\n` +
    `You may replace this file with your own build of the same version.\n`,
);
