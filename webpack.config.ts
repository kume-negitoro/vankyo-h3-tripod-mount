import path from 'path'
import webpack from 'webpack'
import { OpenJSCADWebpackPlugin } from 'openjscad-webpack-plugin'

const config: webpack.Configuration = {
    target: 'node',

    entry: path.join(__dirname, 'src/index.ts'),
    output: {
        filename: `vankyo-h3-tripod-mounter.jscad`,
        path: path.join(__dirname, 'dist'),
        libraryTarget: 'commonjs2',
    },

    module: {
        rules: [
            {
                test: /.ts$/,
                loader: 'esbuild-loader',
                options: { loader: 'ts' }
            },
        ],
    },

    plugins: [
        new OpenJSCADWebpackPlugin({
            format: 'stl',
        }),
    ],
}

export default config
