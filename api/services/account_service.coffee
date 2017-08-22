Accounts = require('mongoose').model 'Accounts'
_ = require 'lodash'
nodemailer = require 'nodemailer'
randomString = require 'randomstring'

AccountService =
  create: (params) ->
    deferred = Promise.defer()

    query =
      username: params.username
    Accounts.find query
    .then (findRes) =>
      if _.isEmpty(findRes)

        params.verificationCode = randomString.generate(30)
        account = new Accounts params
        account.save()
        .then (res) =>
          @sendVerficationEmail params
          .then (email) ->
            deferred.resolve res
          .catch (err) ->
            deferred.reject err

        .catch (err) ->
          deferred.reject err
      else
        deferred.reject 'Username already exist.'
    .catch (err) ->
      deferred.reject err

    deferred.promise

  activateAccount: (params) ->
    deferred = Promise.defer()

    query =
      verificationCode: params.code
    @findAll query
    .then (res) =>
      if !_.isEmpty(res)

        account = res[0]
        payload =
          status: 'active'
        @updateAccount account._id, payload
        .then (accountRes) ->
          deferred.resolve accountRes
        .catch (err) ->
          deferred.reject err
    .catch (err) ->
      deferred.reject err

    deferred.promise

  sendVerficationEmail: (params) ->
    deferred = Promise.defer()

    activationLink = "http://52.40.210.205:4000/#/activateaccount?code="
    activationLink += params.verificationCode

    emailMsg = "Thank you for your registration!
      Please click this link to activate your account.
      <a href='" + activationLink+ "'> Account Activation</a>"

    transporter = nodemailer.createTransport
      service: 'Gmail'
      auth:
        user: 'peac.register@gmail.com'
        pass: 'Nov51968'

    mailOptions =
      from: 'melvinjohn_bagsik@yahoo.com'
      to: params.email
      subject: 'Account Verfication'
      html: emailMsg

    transporter.sendMail mailOptions, (err, res) ->
      if err
        deferred.reject err
      else
        deferred.resolve res

    deferred.promise

  findAll: (query) ->
    deferred = Promise.defer()

    Accounts.find query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findOne: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Accounts.findOne query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  updateAccount: (id, params) ->
    deferred = Promise.defer()

    query = _id: id
    delete params.username

    Accounts.findOneAndUpdate query, params, new:true
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  deleteAccount: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Accounts.findOneAndRemove query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

module.exports = AccountService
