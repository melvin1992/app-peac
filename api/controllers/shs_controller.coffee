SHSController = require('express').Router()
SHSService = require '../services/shs_service'

SHSController.route '/'
  .post (req, response) ->
    params = req.body
    SHSService.create params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    SHSService.findAll query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

SHSController.route '/:id'
  .get (req, response) ->
    id = req.params.id
    SHSService.findOne id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .put (req, response) ->
    id = req.params.id
    params = req.body
    SHSService.updateSHS id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .delete (req, response) ->
    id = req.params.id
    SHSService.deleteSHS id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = SHSController
