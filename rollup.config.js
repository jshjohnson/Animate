import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/js/animate.ts',
  output: {
    format: 'umd',
    name: 'Animate',
    dir: 'dist',
  },
  plugins: [typescript()],
};
