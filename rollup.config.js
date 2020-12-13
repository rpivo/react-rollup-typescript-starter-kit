import { brotliCompressSync } from 'zlib'
import fs from 'fs/promises'
import path from 'path'

import commonjs from '@rollup/plugin-commonjs'
import gzipPlugin from 'rollup-plugin-gzip'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'

const { NODE_ENV } = process.env

function deleteJSFiles() {
  return {
    async writeBundle() {
      const buildPath = `${path.resolve()}/dist`
      try {
        const files = await fs.readdir(buildPath)
        const promises = []

        for (const file of files) {
          if (file.endsWith('.js')) promises.push(fs.unlink(path.join(buildPath, file)))
        }
        await Promise.all(promises)
      } catch (e) {
        console.log('An error occurred while trying to delete js files from the build folder.', e)
      }
    },
  }
}

export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'esm',
    manualChunks: {
      react: ['react'],
      reactDOM: ['react-dom'],
    },
    plugins: NODE_ENV === 'production' && [terser()],
  },
  plugins: [
    NODE_ENV === 'production' && gzipPlugin({
      customCompression: content => brotliCompressSync(Buffer.from(content)),
      fileName: '.br',
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify(NODE_ENV) }),
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    typescript(),
    NODE_ENV === 'production' && deleteJSFiles(),
  ],
}
