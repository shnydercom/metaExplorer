const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

var wpCfgAdjusted = {};
Object.assign(wpCfgAdjusted, webpackConfig, {
	node: {
		fs: 'empty'
	}
});
module.exports = function (config) {
	config.set({
		basePath: "",
		plugins: [
			"karma-*"
		],
		frameworks: [
			"jasmine",
			"sinon",
			"jasmine-sinon",
			"source-map-support",
		],
		files: [
			"./node_modules/react/dist/react.js",
			"./node_modules/react-dom/dist/react-dom.js",
			//{ pattern: "src/**/*.ts", included: true },
			//{ pattern: "src/**/*.tsx", included: true },
			{
				pattern: "testing/**/*.ts",
				included: true
			},
			{
				pattern: "tests/**/*.spec.ts",
				included: true
			},
			"tests/test_app.tsx",
			"tests/index.js",

			{
				pattern: "src/examples/*.spec.ts",
				included: false
			},
			{
				pattern: "src/**/*.scss",
				included: false
			},
		],
		exclude: [
			"jsonld-request",
			"server",
			"src/examples/*",
		],

		preprocessors: {
			'**/*.ts': ['webpack'],
			'**/*.tsx': ['webpack'],
			'tests/**/*.ts': ['webpack']
		},
		mime: {
			"text/x-typescript": ["ts", "tsx"]
		},
		webpack: wpCfgAdjusted,
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
		reporters: [ //"progress", "karma-typescript",
			"spec"
		],
		port: 9876,
		colors: true,
		logLevel: config.LOG_DEBUG,
		autoWatch: true,
		browsers: [
      'ChromeDebugging'
    ],
		//browsers: (process.env.TRAVIS) ? ['Chrome_travis_ci'] : ["Chrome"],
		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			},
			ChromeDebugging: {
				base: 'Chrome',
				flags: [ '--remote-debugging-port=9333' ]
			}
		},
		singleRun: false,
		concurrency: Infinity
	})
};
