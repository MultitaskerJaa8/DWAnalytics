module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'ajv': require.resolve('ajv'),
      };
      return webpackConfig;
    },
  },
};
