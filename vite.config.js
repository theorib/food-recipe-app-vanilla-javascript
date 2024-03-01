/** @type {import('vite').UserConfig} */
import 'dotenv/config';

export default {
  build: {
    target: 'es2020', // or other compatible target like 'chrome87'
  },
  define: {
    'process.env': process.env,
  },
};
