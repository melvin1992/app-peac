Accounts = require('mongoose').model 'Accounts'
Admins = require('mongoose').model 'Admins'
_ = require 'lodash'
nodemailer = require 'nodemailer'

LoginService =
  login: (params) ->
    deferred = Promise.defer()

    query =
      username: params.username
      password: params.password
      status: 'active'
    Accounts.findOne query
    .then (res) ->
      if(_.isEmpty(res))
        deferred.reject 'Incorrect Login'
      else
        deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  loginAdmin: (params) ->
    deferred = Promise.defer()

    query =
      username: params.username
      password: params.password
      status: 'active'
    Admins.findOne query
    .then (res) ->
      if(_.isEmpty(res))
        deferred.reject 'Incorrect Login'
      else
        deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  forgotPassword: (params) ->
    deferred = Promise.defer()

    query =
      username: params.username
      email: params.email
    Accounts.findOne query
    .then (res) =>
      if(_.isEmpty(res))
        deferred.reject 'No account found'
      else
        payload =
          name: res.firstName
          username: res.username
          password: res.password
          email: res.email
        @sendEmail payload
        .then (em) ->
          deferred.resolve em
        .catch (err) ->
          deferred.reject err
    .catch (err) ->
      deferred.reject err

    deferred.promise

  sendEmail: (params) ->
    deferred = Promise.defer()
    console.log params
    emailMsg = "Good day, " + params.name + "<br/><br/>
      Please see below for your account details <br/><br/>
      Username: " + params.username + "<br/>
      Password: " + params.password + ""

    transporter = nodemailer.createTransport
      service: 'Gmail'
      auth:
        user: 'peac.register@gmail.com'
        pass: 'Nov51968'

    mailOptions =
      from: 'peac.register@gmail.com'
      to: params.email
      subject: 'Forgot Password'
      html: emailMsg

    transporter.sendMail mailOptions, (err, res) ->
      if err
        deferred.reject err
        console.log err
      else
        deferred.resolve res
        console.log res

    deferred.promise

module.exports = LoginService
