module.exports = {
  lintOnSave: false,
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
  },
  productionSourceMap: false,
  css: {
    sourceMap: false,
    extract: false
  }
}