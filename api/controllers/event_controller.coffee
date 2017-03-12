EventController = require('express').Router()
EventService = require '../services/event_service'

EventController.route '/'
  .post (req, response) ->
    params = req.body
    EventService.create params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    EventService.findAll query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

EventController.route '/addparticipants'
  .post (req, response) ->
    id = req.body.eventId
    params = req.body.count
    EventService.addParticipants id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

EventController.route '/:id'
  .get (req, response) ->
    id = req.params.id
    EventService.findOne id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .put (req, response) ->
    id = req.params.id
    params = req.body
    EventService.updateEvent id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .delete (req, response) ->
    id = req.params.id
    EventService.deleteEvent id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err



module.exports = EventController
