module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => { 
      webpackConfig.module.rules.push({
        test: /\.yml$/i,
        loader: 'raw-loader',
      });
      return webpackConfig;
    }
  }
};