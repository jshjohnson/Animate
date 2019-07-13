import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import {
  uglify
} from 'rollup-plugin-uglify'

export default {
  input: './src/js/animate.ts',
  output: {
    format: 'umd',
    name: 'Animate',
    dir: 'dist/js',
  },
  plugins: [resolve(), commonjs(), typescript(), uglify()],
}