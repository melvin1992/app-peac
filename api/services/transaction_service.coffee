Transactions = require('mongoose').model 'Transactions'
EventService = require './event_service'

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
      deferred.resolve res
    .catch (err) ->
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
