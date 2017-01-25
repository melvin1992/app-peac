AdminController = require('express').Router()
AdminService = require '../services/admin_service'

AdminController.route '/'
  .post (req, response) ->
    params = req.body
    AdminService.create params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    AdminService.findAll query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

AdminController.route '/:id'
  .get (req, response) ->
    id = req.params.id
    AdminService.findOne id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .put (req, response) ->
    id = req.params.id
    params = req.body
    AdminService.updateAdmin id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .delete (req, response) ->
    id = req.params.id
    AdminService.deleteAdmin id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = AdminController
