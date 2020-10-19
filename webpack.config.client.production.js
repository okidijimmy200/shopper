//This will configure Webpack to bundle the React code to be used in production mode.
const path = require('path')
const CURRENT_WORKING_DIR = process.cwd()

const config = {
    mode: "production",
    entry: [
        path.join(CURRENT_WORKING_DIR, 'client/main.js')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR , '/dist'),
        filename: 'bundle.js',
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        ]
    }
}

module.exports = config

/**The configuration here is similar to the client-side configuration for development
mode, but without the hot-reloading plugin and debug configuration as these will not
be required in production */
