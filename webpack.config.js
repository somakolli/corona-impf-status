import CopyPlugin from 'copy-webpack-plugin'

export default {
    mode: 'production',
    module: {
      rules: [{
          test: /\.txt$/i,
          loader: 'raw-loader'
      }]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "index.html", to: "."},
            ],
        }),
    ],
    externals: {
        moment: 'moment'
    }
};
