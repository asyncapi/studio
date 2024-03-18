/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * @param {import('next/dist/server/config-shared').NextJsWebpackConfig} config
   * @returns 
   */
  webpack: (
    config,
    { isServer }
  ) => {
    const fallback = config.resolve.fallback || (config.resolve.fallback = {});

    Object.assign(fallback, {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      url: require.resolve("url/"),
      util: require.resolve("util/"),
    });
    
    if (!isServer) {
      fallback.fs = false;
      fallback.path = false;
      fallback.util = false;
    }

    config.resolve.fallback = fallback;

    config.module.rules.push({
      test: /\.node/,
      use: 'raw-loader',
    });

    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })

    return config;
  }
}

module.exports = nextConfig
