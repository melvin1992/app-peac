DepositController = require('express').Router()
DepositService = require '../services/deposit_service'

gm = require 'gm'

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
    gm(req.file.path).resize(800, 500).write(req.file.path, (err) ->
      if(err)
        response.status(400).send 'ERROR'
      else
        response.status(201).send req.file.filename
    )

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
      response.status(400).json err

DepositController.route '/:id'
  .get (req, response) ->
    id = req.params.id
    DepositService.findOne id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .put (req, response) ->
    id = req.params.id
    params = req.body
    DepositService.updateDeposit id, params
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err

  .delete (req, response) ->
    id = req.params.id
    DepositService.deleteDeposit id
    .then (res) ->
      response.status(200).json res
    .catch (err) ->
      response.status(400).json err


module.exports = DepositController
