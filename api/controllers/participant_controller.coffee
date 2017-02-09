ParticipantController = require('express').Router()
ParticipantService = require '../services/participant_service'

ParticipantController.route '/'
  .post (req, response) ->
    params = req.body
    ParticipantService.create params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    ParticipantService.findAll query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

ParticipantController.route '/:id'
  .get (req, response) ->
    id = req.params.id
    ParticipantService.findOne id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .put (req, response) ->
    id = req.params.id
    params = req.body
    ParticipantService.updateParticipant id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .delete (req, response) ->
    id = req.params.id
    ParticipantService.deleteParticipant id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = ParticipantController
