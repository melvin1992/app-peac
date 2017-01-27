LocationController = require('express').Router()
LocationService = require '../services/location_service'

LocationController.route '/regions'
  .post (req, response) ->
    params = req.body
    LocationService.createRegion params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    LocationService.findAllRegion query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

LocationController.route '/regions/:id'
  .get (req, response) ->
    id = req.params.id
    LocationService.findOneRegion id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .put (req, response) ->
    id = req.params.id
    params = req.body
    LocationService.updateRegion id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .delete (req, response) ->
    id = req.params.id
    LocationService.deleteRegion id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

LocationController.route '/provinces'
  .post (req, response) ->
    params = req.body
    LocationService.createProvince params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    LocationService.findAllProvince query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

LocationController.route '/provinces/:id'
  .get (req, response) ->
    id = req.params.id
    LocationService.findOneProvince id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .put (req, response) ->
    id = req.params.id
    params = req.body
    LocationService.updateProvince id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .delete (req, response) ->
    id = req.params.id
    LocationService.deleteProvince id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = LocationController
