AccountController = require '../api/controllers/account_controller'
JHSController = require '../api/controllers/jhs_controller'
SHSController = require '../api/controllers/shs_controller'
EventController = require '../api/controllers/event_controller'
LoginController = require '../api/controllers/login_controller'
AdminController = require '../api/controllers/admin_controller'
SettingController = require '../api/controllers/setting_controller'

class Routes
  constructor: (app) ->
    @app = app

  registerRoutes: ->
    @app.use('/api/login', LoginController)
    @app.use('/api/accounts', AccountController)
    @app.use('/api/jhs', JHSController)
    @app.use('/api/shs', SHSController)
    @app.use('/api/events', EventController)
    # Admin API

    @app.use('/api/admin/accounts', AdminController)
    @app.use('/api/admin/settings', SettingController)

module.exports = Routes
