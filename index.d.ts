declare module '*.scss' {
  const value: string;

  export default value;
}

declare module 'cname-webpack-plugin' {
  import type { WebpackPluginInstance } from 'webpack';

  export default class CnameWebpackPlugin implements WebpackPluginInstance {
    constructor(options: { domain: string });
    apply: WebpackPluginInstance['apply'];
  }
}
