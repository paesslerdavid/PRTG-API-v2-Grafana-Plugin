import type { Configuration } from 'webpack';
const grafanaConfig = require('./.config/webpack/webpack.config.js');

const config = (env: any): Configuration => {
  return grafanaConfig(env);
};

export default config;
