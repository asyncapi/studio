/** @type {import('next').NextConfig} */

const path = require("path");
const webpack = require("webpack");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withTM = require("next-transpile-modules")([
  // `monaco-editor` isn't published to npm correctly: it includes both CSS
  // imports and non-Node friendly syntax, so it needs to be compiled.
  "monaco-editor",
]);

const nodeExternals = require('webpack-node-externals');

// Monaco Editor uses CSS imports internally,
// so we need a separate css-loader for app and monaco-editor packages and other packages
const MONACO_DIR = path.resolve(__dirname, "../../node_modules/");

function setEnvironments() {
  process.env.DISABLE_ESLINT_PLUGIN = "true";
}

const nextConfig = withTM({
  //This is temporary fix for netlify build
  distDir: "build",
  // This has been added as some modules are not transpiled correctly
  experimental: {
    esmExternals: "loose",
  },
  webpack: (config, { dev, isServer }) => {
    // Additional configurations
    // configureCrypto();
    setEnvironments();

    const rule = config.module.rules
      .find((rule) => rule.oneOf)
      .oneOf.find(
        (r) =>
          // Find the global CSS loader
          r.issuer && r.issuer.include && r.issuer.include.includes("_app")
      );
    if (rule) {
      rule.issuer.include = [
        rule.issuer.include,
        // Allow `monaco-editor` to import global CSS:
        /[\\/]node_modules[\\/]monaco-editor[\\/]/,
      ];
    }
    // fix import of monaco-editor css files
    config.module.rules.push(
      // For monaco-editor support
      {
        test: /\.css$/,
        include: MONACO_DIR,
        use: ["style-loader", "css-loader"],
      },
      // For tailwindcss support
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      // For yaml support
      {
        test: /\.yml$/i,
        type: "asset/source",
      },
      // For canvas.node support
      {
        test: /\.node$/,
        use: "node-loader",
      }
    );

    // Workaround for "Critical dependency: require function is used in a way in which dependencies cannot be statically extracted"
    config.module.unknownContextCritical = false;

    // fallbacks
    const fallback = config.resolve.fallback || {};
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
    }

    config.resolve.fallback = fallback;

    // aliases
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["nimma/fallbacks"] = require.resolve(
      "../../node_modules/nimma/dist/legacy/cjs/fallbacks/index.js"
    );
    config.resolve.alias["nimma/legacy"] = require.resolve(
      "../../node_modules/nimma/dist/legacy/cjs/index.js"
    );

    // plugins
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        process: "process/browser.js",
        Buffer: ["buffer", "Buffer"],
      }),
    ]);

    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: [
            "json",
            "markdown",
            "css",
            "typescript",
            "javascript",
            "html",
            "graphql",
            "python",
            "scss",
            "yaml",
          ],
          filename: "static/[name].worker.js",
        })
      );
    }

    if (config.module.generator?.asset?.filename) {
      if (!config.module.generator["asset/resource"]) {
        config.module.generator["asset/resource"] =
          config.module.generator.asset;
      }
      delete config.module.generator.asset;
    }

    // ignore source-map warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Failed to parse source map/,
    ];

    if(isServer) {
      config.externals = [
        nodeExternals()
      ]
    }

    return config;
  },
});

module.exports = nextConfig;
