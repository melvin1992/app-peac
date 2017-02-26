AccountController = require('express').Router()
AccountService = require '../services/account_service'

AccountController.route '/'
  .post (req, response) ->
    params = req.body
    AccountService.create params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    AccountService.findAll query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

AccountController.route '/:id'
  .get (req, response) ->
    id = req.params.id
    AccountService.findOne id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .put (req, response) ->
    id = req.params.id
    params = req.body
    AccountService.updateAccount id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .delete (req, response) ->
    id = req.params.id
    AccountService.deleteAccount id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

AccountController.route '/accountVerification'
  .post (req, response) ->
    params = req.body
    AccountService.activateAccount params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = AccountController
