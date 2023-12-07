const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
	reactStrictMode: true,
	transpilePackages: ['ui'],
	async rewrites() {
		return [
			{
				source: '/api/v1/:path*',
				destination: 'http://localhost:5001/:path*', // Proxy to Backend
			},
		];
	},
});
