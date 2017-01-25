SettingController = require('express').Router()
SettingService = require '../services/setting_service'

SettingController.route '/'
  .post (req, response) ->
    params = req.body
    SettingService.create params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    SettingService.findActiveYear query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = SettingController
