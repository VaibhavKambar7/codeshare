const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self' https://codeshare.lol https://www.codeshare.lol https://cdn.jsdelivr.net",
              "connect-src 'self' wss://localhost:3001 ws://localhost:3001 wss://codeshare.lol:3001 wss://www.codeshare.lol:3001 https://lh3.googleusercontent.com",
              "style-src 'self' 'unsafe-inline'",
              "style-src-attr 'unsafe-inline'",
              "style-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
              "script-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "worker-src 'self' blob:",
              "font-src 'self' data: https://cdn.jsdelivr.net",
              "img-src 'self' data: https://lh3.googleusercontent.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
export default nextConfig;
