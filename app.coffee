express = require 'express'
session = require 'express-session'
path = require 'path'
logger = require 'morgan'
cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'
cors = require 'cors'
lusca = require 'lusca'
db = require './config/database'
config = require './config/config'
routes = require './routes/routes'

app = express()

app.use express.static(__dirname+'/app')
app.use session config.session
app.use logger 'dev'
app.use bodyParser.json()
app.use cookieParser()
app.use bodyParser.urlencoded(extended: false)
app.use lusca config.lusca
app.disable 'x-powered-by'

new routes(app)
  .registerRoutes()

app.use cors()

module.exports = app
