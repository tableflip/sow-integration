var runner = require('./index')
var spawn = require('child_process').spawn

runner(function () {
  console.log('starting nightwatch')
  spawn('node_modules/.bin/nightwatch', [], { cwd: __dirname, stdio: 'inherit' })
})
