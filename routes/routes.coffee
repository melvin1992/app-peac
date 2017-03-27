AccountController = require '../api/controllers/account_controller'
JHSController = require '../api/controllers/jhs_controller'
SHSController = require '../api/controllers/shs_controller'
EventController = require '../api/controllers/event_controller'
LoginController = require '../api/controllers/login_controller'
AdminController = require '../api/controllers/admin_controller'
SettingController = require '../api/controllers/setting_controller'
LocationController = require '../api/controllers/location_controller'
TransactionController = require '../api/controllers/transaction_controller'
ParticipantController = require '../api/controllers/participant_controller'
DepositController = require '../api/controllers/deposit_controller'

class Routes
  constructor: (app) ->
    @app = app

  registerRoutes: ->
    @app.use('/api/login', LoginController)
    @app.use('/api/accounts', AccountController)
    @app.use('/api/jhs', JHSController)
    @app.use('/api/shs', SHSController)
    @app.use('/api/events', EventController)
    @app.use('/api/locations', LocationController)
    @app.use('/api/transactions', TransactionController)
    @app.use('/api/participants', ParticipantController)
    @app.use('/api/deposits', DepositController)

    # Admin API
    @app.use('/api/admin/accounts', AdminController)
    @app.use('/api/admin/settings', SettingController)

module.exports = Routes
