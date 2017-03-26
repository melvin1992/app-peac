ReportController = require('express').Router()
ReportService = require '../services/report_service'

ReportController.route '/paidtransactions'
  .get (req, response) ->
    eventId = req.query.eventId
    ReportService.getPaidTransaction eventId
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = ReportController
