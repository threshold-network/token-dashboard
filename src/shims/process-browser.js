// Simple process.browser shim
module.exports = {
  browser: true,
  env: {},
  nextTick: function (cb) {
    setTimeout(cb, 0)
  },
}
