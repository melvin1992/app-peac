Deposits = require('mongoose').model 'Deposits'
Transactions = require('mongoose').model 'Transactions'
_ = require 'lodash'

DepositService =
  create: (params) ->
    deferred = Promise.defer()

    _query = depositReferenceNo: params.depositReferenceNo
    @findAll _query
    .then (ref) ->
      if(_.isEmpty(ref))
        ctr = 0
        deposit = new Deposits params
        deposit.save()
        .then (res) ->
          params.registrationCodes.forEach (value) ->
            data = status: "processing"
            query = registrationCode: value
            Transactions.findOneAndUpdate query, data
            .then (res) ->
              ctr += 1
              if params.registrationCodes.length == ctr
                deferred.resolve res
            .catch (err) ->
              deferred.reject err
        .catch (err) ->
          deferred.reject err
      else
        deferred.reject 'Reference Number already  exist'
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findAll: (query) ->
    deferred = Promise.defer()

    Deposits.find query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findOne: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Deposits.findOne query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  updateDeposit: (id, params) ->
    deferred = Promise.defer()

    query = _id: id
    Deposits.findOneAndUpdate query, params, new:true
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  deleteDeposit: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Deposits.findOneAndRemove query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise



module.exports = DepositService
