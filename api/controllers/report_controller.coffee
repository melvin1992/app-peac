ReportController = require('express').Router()
ReportService = require '../services/report_service'

ReportController.route '/events'
  .get (req, response) ->
    query = req.query
    ReportService.getEventReport query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = ReportController
