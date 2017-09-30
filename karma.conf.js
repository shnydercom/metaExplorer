const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

var wpCfgAdjusted = {};
Object.assign(wpCfgAdjusted, webpackConfig, {node: {
    fs: 'empty'
}}) ;
module.exports = function(config) {
    config.set({
        basePath: "",
        plugins: [
            "karma-*",
            //drequire("./integration-tests/server/server")
        ],
        frameworks: [
            "jasmine",
            "sinon",
            "jasmine-sinon",
            "source-map-support",
            //"karma-typescript"
            //"hydra-testserver"
        ],
        files: [
            "./node_modules/react/dist/react.js",
            "./node_modules/react-dom/dist/react-dom.js",
            { pattern: "src/**/*.ts", included: true },
            { pattern: "src/**/*.tsx", included: true },
            { pattern: "testing/**/*.ts", included: true },
            { pattern: "tests/**/*.spec.ts", included: true },
            

            { pattern: "src/examples/*.spec.ts", included:false },
            { pattern: "src/**/*.scss", included: false },
            //{ pattern: "integration-tests/**/*.spec.ts", included: true }
        ],
        exclude: [
            "jsonld-request",
            "server",
            "src/examples/*",
            //"node_modules/*"
        ],
        //preprocessors: {
        //    "**/*.ts": ["karma-typescript"]
        //},

        preprocessors: {
            '**/*.ts': ['webpack'],
            '**/*.tsx': ['webpack'],
            'tests/**/*.ts': ['webpack']
        },
        mime: {
            "text/x-typescript": ["ts", "tsx"]
        },
        webpack: wpCfgAdjusted,/*{
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        use: [
                            "babel-loader",
                            "awesome-typescript-loader"
                        ]
                    }
                ]
            },
            resolve: {
                extensions: [".webpack.js", ".web.js", ".js", ".ts", ".tsx", ".css"]
            },
            node: {
                fs: 'empty'
            }
        },*/

        karmaTypescriptConfig: {
            tsconfig: "tsconfig.json",
            coverageOptions: {
                instrumentation: false
            },
            bundlerOptions: {
                entrypoints: /\.spec\.ts$/,
                exclude: [
                    "jsonld-request",
                    "pkginfo"
                ]
            }
        },
        reporters: ["progress", "karma-typescript"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: (process.env.TRAVIS) ? ['Chrome_travis_ci'] : ["Chrome"],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        singleRun: false,
        concurrency: Infinity
    })
};
