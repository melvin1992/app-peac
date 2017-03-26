Transactions = require('mongoose').model 'Transactions'
EventService = require './event_service'
converter = require 'number-to-words'
_ = require 'lodash'

TransactionService =
  create: (params) ->
    deferred = Promise.defer()

    trans = params.transaction

    transaction = new Transactions trans
    transaction.save()
    .then (tranRes) ->

      eventId = trans.eventID

      if(trans.eventType == 'SHS INSET' || trans.eventType == 'JHS INSET')
        count = {}
        params.data.forEach (value) ->
          subject = value.code
          count[subject] = 1
      else
        count = trans.participantsCount

      EventService.deductParticipants eventId, count
      .then (res) ->
        deferred.resolve tranRes
      .catch (err) ->
        deferred.reject err

    .catch (err) ->
      deferred.reject err

    deferred.promise

  findAll: (query) ->
    deferred = Promise.defer()

    Transactions.find query
    .sort {date: -1}
    .then (res) ->

      payload = []
      _.forEach res, (trans) ->
        data = trans.toObject()
        data.amountInWords = converter.toWords(trans.totalAmount)
        payload.push data
      deferred.resolve payload

    .catch (err) ->
      console.log err
      deferred.reject err

    deferred.promise

  findOne: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Transactions.findOne query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  updateTransaction: (id, params) ->
    deferred = Promise.defer()

    query = _id: id
    Transactions.findOneAndUpdate query, params, new:true
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  deleteTransaction: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Transactions.findOneAndRemove query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

module.exports = TransactionService
