var util = require('util')
var spawn = require('child_process').spawn
var EventEmitter = require('events').EventEmitter

util.inherits(Run, EventEmitter)
module.exports = Run

function Run (cmd, args, opts) {
  var proc = spawn(cmd, args, opts)
  proc.stdout.on('data', function (data) {
    this.emit('data', data)
    if (data.toString('utf8').indexOf(opts.waitFor) === -1) return
    this.ready = true
    this.emit('ready')
  })
  proc.stderr.on('data', function (data) {
    this.emit('error', data)
  })
  this.emit('started', proc)
}

