path = require 'path'
dotenv = require('dotenv').load(path:'.env')
rootPath = path.normalize __dirname + '/..'

module.exports =
  root: rootPath
  getHostURI: (env) ->
    "#{process.env.MONGODB_URI}/PEACRegistration"
  session:
    secret: 'abc'
    resave: true
    saveUninitialized: true
  lusca:
    xframe: 'DENY'
    xssProtection: true
    nosniff: true
