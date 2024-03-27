module.exports = {
	reactStrictMode: true,
	transpilePackages: ['ui'],
	async rewrites() {
		return [
			{
				source: '/api/v1/:path*',
				destination: 'http://localhost:5001/api/v1/:path*', // Proxy to Backend
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.googleusercontent.com',
				port: '',
				pathname: '**',
			},
		],
	},
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.externals.push({
			'utf-8-validate': 'commonjs utf-8-validate',
			bufferutil: 'commonjs bufferutil',
		});
		return config;
	},
};
