mongoose = require 'mongoose'
glob = require 'glob'
colors = require 'colors'
config = require './config'
env = process.env.NODE_ENV

mongoose.connect config.getHostURI(env),
{ server: { reconnectTries: Number.MAX_VALUE }}

mongoose.connection.on 'error', (err) ->
  console.log "Mongoose connection error: #{err}".underline.red

mongoose.connection.on 'connected', ->
  mongoose.Promise = require('q').Promise
  console.log "Mongoose connected....".underline.green

models = glob.sync "#{config.root}/api/models/*.coffee"
models.forEach (model) ->
  require model
