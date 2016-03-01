var runner = require('./index')
var spawn = require('child_process').spawn

runner(function () {
  console.log('starting nightwatch')

  var args = []

  if (process.env.NIGHTWATCH_ENV) {
    args = args.concat('--env', process.env.NIGHTWATCH_ENV)
  }

  if (process.env.NIGHTWATCH_TEST) {
    args = args.concat('--test', process.env.NIGHTWATCH_TEST)
  }

  if (process.env.NIGHTWATCH_TEST_CASE) {
    args = args.concat('--testcase', process.env.NIGHTWATCH_TEST_CASE)
  }

  var proc = spawn('node_modules/.bin/nightwatch', args, {cwd: __dirname, stdio: 'inherit'})

  proc.on('close', function () {
    runner.stop(function (err) {
      if (err) throw err
    })
  })
})
