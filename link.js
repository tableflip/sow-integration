var fs = require('fs')
var path = require('path')
var runner = require('./index')

runner.checkForMissingApps()

runner.apps.forEach(function (app) {
  var dest = path.join(__dirname, 'node_modules', app.name)
  fs.symlinkSync(app.root, dest)
})
