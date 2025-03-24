
module.exports = {
    experimental: {
      serverActions: {
        allowedOrigins: [
          'localhost:3000', // localhost
          'foobar-3000.app.github.dev', // Codespaces
        ],
      },
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'img.clerk.com',
        },
      ],
    },
  };
  
