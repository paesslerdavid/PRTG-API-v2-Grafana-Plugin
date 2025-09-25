import type { Configuration } from 'webpack';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const config = (env: any): Configuration => {
  const isProduction = env.production;
  const isDevelopment = !isProduction;

  return {
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },

    context: path.join(process.cwd()),

    devtool: isDevelopment ? 'eval-source-map' : 'source-map',

    entry: {
      module: './src/module.ts',
    },

    externals: [
      'lodash',
      'jquery',
      'moment',
      'slate',
      'emotion',
      '@emotion/react',
      '@emotion/css',
      'prismjs',
      'slate-plain-serializer',
      '@grafana/slate-react',
      'react',
      'react-dom',
      'rxjs',
      'rxjs/operators',
      'd3',
      'ol/layer/Vector',
      'ol/source/Vector',
      'ol/Feature',
      'ol/geom/Point',
      'ol/style/Style',
      'ol/style/Circle',
      'ol/style/Fill',
      'ol/style/Stroke',
      'ol/style/Text',
      function ({ context, request }, callback) {
        const prefix = 'grafana/';
        const hasPrefix = request && request.indexOf(prefix) === 0;
        const acceptedRequests = ['@grafana/ui', '@grafana/data', '@grafana/runtime'];

        if (hasPrefix || acceptedRequests.includes(request!)) {
          return callback(undefined, request);
        }
        callback();
      },
    ],

    mode: isProduction ? 'production' : 'development',

    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.[tj]sx?$/,
          use: {
            loader: 'swc-loader',
            options: {
              jsc: {
                baseUrl: './src',
                target: 'es2018',
                loose: false,
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  decorators: false,
                  dynamicImport: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/img/[name].[hash][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[name].[hash][ext]',
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },

    output: {
      clean: {
        keep: /gpx_.*\.exe/,
      },
      filename: '[name].js',
      library: {
        type: 'amd',
      },
      path: path.resolve(process.cwd(), 'dist'),
      publicPath: '/',
    },

    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/plugin.json', to: '.' },
          { from: 'src/img/', to: 'img/' },
          { from: 'README.md', to: '.' },
          { from: 'CHANGELOG.md', to: '.' },
          { from: 'LICENSE', to: '.' },
        ],
      }),

      new ForkTsCheckerWebpackPlugin({
        async: isDevelopment,
        typescript: {
          configFile: path.join(process.cwd(), 'tsconfig.json'),
        },
      }),

      new ESLintPlugin({
        extensions: ['.ts', '.tsx'],
        lintDirtyModulesOnly: isDevelopment,
      }),

      new ReplaceInFileWebpackPlugin([
        {
          dir: 'dist',
          files: ['plugin.json', 'README.md'],
          rules: [
            {
              search: /\%VERSION\%/g,
              replace: process.env.npm_package_version || '1.0.0',
            },
            {
              search: /\%TODAY\%/g,
              replace: new Date().toISOString().substring(0, 10),
            },
          ],
        },
      ]),
    ],

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      modules: [path.resolve(process.cwd(), 'src'), 'node_modules'],
      unsafeCache: true,
    },
  };
};

export default config;