DepositController = require('express').Router()
DepositService = require '../services/deposit_service'

multer = require('multer')
storage = multer.diskStorage {
  destination: (req, file, cb) ->
    cb(null,'./app/assets/uploads')
  filename: (req, file, cb) ->
    timestamp = Date.now()
    cb(null,timestamp + '-' + file.originalname)
}
upload = multer({storage:storage})

DepositController.route '/upload'
  .post upload.single('file'), (req, response) ->
    response.status(201).send req.file.filename

DepositController.route '/'
  .post (req, response) ->
    params = req.body
    DepositService.create params
    .then (res) ->
      response.status(201).json res
    .catch (err) ->
      response.status(400).json err

  .get (req, response) ->
    query = req.query
    DepositService.findAll query
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json res

DepositController.route '/:id'
  .get (req, response) ->
    id = req.params.id
    DepositService.findOne id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json res

  .put (req, response) ->
    id = req.params.id
    params = req.body
    DepositService.updateDeposit id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json res

  .delete (req, response) ->
    id = req.params.id
    DepositService.deleteDeposit id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json res


module.exports = DepositController
