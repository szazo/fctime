module.exports = {
		entry: './app/app.tsx',
		output: {
				filename: 'bundle.js'
		},

		devtool: 'source-map',

		resolve: {
				extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
		},

		module: {
				loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },
						{ test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" },
						{ test: /\.css$/, loader: "style-loader!css-loader" }
        ],
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]				
		},
}
