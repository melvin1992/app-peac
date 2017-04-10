LoginController = require('express').Router()
LoginService = require '../services/login_service'

LoginController.route '/'
  .post (req, response) ->
    params = req.body
    LoginService.login params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

LoginController.route '/admin'
  .post (req, response) ->
    params = req.body
    LoginService.loginAdmin params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

LoginController.route '/forgotpass'
  .post (req, response) ->
    params = req.body
    LoginService.forgotPassword params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = LoginController
