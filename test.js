var runner = require('./index')
var spawn = require('child_process').spawn

runner(function () {
  console.log('starting nightwatch')

  var proc = spawn('node_modules/.bin/nightwatch', [], {cwd: __dirname, stdio: 'inherit'})

  proc.on('close', function () {
    runner.stop(function (err) {
      if (err) throw err
    })
  })
})
