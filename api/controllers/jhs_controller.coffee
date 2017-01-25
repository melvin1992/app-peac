JHSController = require('express').Router()
JHSService = require '../services/jhs_service'

JHSController.route '/'
  .post (req, response) ->
    params = req.body
    JHSService.create params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    JHSService.findAll query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

JHSController.route '/:id'
  .get (req, response) ->
    id = req.params.id
    JHSService.findOne id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .put (req, response) ->
    id = req.params.id
    params = req.body
    JHSService.updateJHS id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .delete (req, response) ->
    id = req.params.id
    JHSService.deleteJHS id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = JHSController
