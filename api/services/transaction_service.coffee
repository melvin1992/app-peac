Transactions = require('mongoose').model 'Transactions'

TransactionService =
  create: (params) ->
    deferred = Promise.defer()

    transaction = new Transactions params
    transaction.save()
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findAll: (query) ->
    deferred = Promise.defer()

    Transactions.find query
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
