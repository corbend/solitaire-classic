var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: [
		'./src/main',
		'webpack-dev-server/client?http://localhost:8000'
	],
	output: {
		publicPath: '/',
		filename: 'bundle.js'
	},
	debug: true,
  	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				include: [
			        path.resolve(__dirname, "src"),
			    ],
				query: {
					presets: ['es2015', 'react', 'stage-0']
				}
			},
			{
        		test: /\.less$/,
        		loader: "style!css!less"
      		},
		]
	},
	devServer: {
		port: '8000',
    	contentBase: "./src"
  	}
}