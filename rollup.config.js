import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import {
  uglify
} from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license';

const banner = [
  '/*! ',
  '<%= pkg.name %> ',
  'v<%= pkg.version %> | ',
  `(c) <%= moment().format('YYYY-MM-DD') %> <%= pkg.author %> |`,
  ' <%= pkg.homepage %>',
  ' */',
].join('');

export default {
  input: './src/scripts/animate.ts',
  output: {
    format: 'umd',
    name: 'Animate',
    file: 'dist/scripts/animate.min.js',
  },
  plugins: [resolve(), commonjs(), typescript(), uglify(), license({
    banner,
  })],
}