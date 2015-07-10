var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn
var chalk = require('chalk')

// TODO: config
var baseDir = process.env.BASE_DIR || path.normalize(path.join(__dirname, '..'))

var apps = [
  { name: 'schoolofwok.co.uk', waitFor: 'KeystoneJS Started' },
  { name: 'sow-api', waitFor: 'Server running'},
  { name: 'sow-backoffice', waitFor: 'Server running' }

].map(function (app) {
  app.root = path.join(baseDir, app.name)
  return app
})

module.exports = function (done) {
  checkForMissingApps()
  startAllApps(done)
}
module.exports.apps = apps
module.exports.checkForMissingApps = checkForMissingApps

function checkForMissingApps () {
  var missing = apps.filter(isMissing)
  if (missing.length > 0) {
    missing.forEach(function (app) {
      console.error(chalk.red('Missing: ', app.name))
    })
    process.exit(-1)
  } else {
    console.log(chalk.green('Found all apps'))
  }
}

function startAllApps (done) {
  apps.forEach(function (app) {
    var env = process.env
    env.NODE_ENV = 'test'
    app.proc = spawn('npm', ['start'], {cwd: app.root, env: env})
    console.log(app.name, 'starting')
    app.proc.stdout.on('data', function (data) {
      if (app.ready || !app.waitFor) console.log(app.name, data.toString('utf8'))
      if (data.toString('utf8').indexOf(app.waitFor) === -1) return
      app.ready = true
      console.log(chalk.green(app.name, 'ready'))
      if (allReady()) {
        done(null, true)
      }
    })
    app.proc.stderr.on('data', function (data) {
      console.error(chalk.red(app.name, data.toString('utf8')))
    })
  })
}

function isMissing (app) {
  return !fs.existsSync(app.root)
}

function isReady (app) {
  return !!app.ready
}

function allReady () {
  return apps.filter(isReady).length === apps.length
}
