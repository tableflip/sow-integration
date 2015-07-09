var runner = require('./index')
var spawn = require('child_process').spawn

runner(function () {
  console.log('starting nightwatch')
  spawn('npm', ['run', 'nightwatch'], { stdio: 'inherit' })
})
