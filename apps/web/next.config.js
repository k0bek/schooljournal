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
};
