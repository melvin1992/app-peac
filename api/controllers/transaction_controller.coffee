TransactionController = require('express').Router()
TransactionService = require '../services/transaction_service'

TransactionController.route '/'
  .post (req, response) ->
    params = req.body
    TransactionService.create params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    TransactionService.findAll query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

TransactionController.route '/:id'
  .get (req, response) ->
    id = req.params.id
    TransactionService.findOne id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .put (req, response) ->
    id = req.params.id
    params = req.body
    TransactionService.updateTransaction id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .delete (req, response) ->
    id = req.params.id
    TransactionService.deleteTransaction id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

module.exports = TransactionController
