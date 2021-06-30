import CopyPlugin from 'copy-webpack-plugin'

export default {
    mode: 'production',
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
