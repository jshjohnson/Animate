import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/js/animate.ts',
  output: {
    format: 'umd',
    name: 'Animate',
    dir: 'dist',
  },
  plugins: [typescript()],
};