mongoose = require 'mongoose'
Schema = mongoose.Schema

AccountSchema = new Schema
  username:
    type: String
    required: true
  password:
    type: String
    required: true
  firstName:
    type: String
    default: ''
  middleName:
    type: String
    default: ''
  lastName:
    type: String
    default: ''
  email:
    type: String
    required: true
  contactNo:
    type: String
    default: ''
  status:
    type: String
    enum: ['active','inactive']
    default: 'active'
  shsSchool:
    schoolID:
      type: String
      default: ''
    schoolName:
      type: String
      default: ''
  jhsSchool:
    schoolID:
      type: String
      default: ''
    schoolName:
      type: String
      default: ''

accountModel = mongoose.model('Accounts', AccountSchema)
module.exports = accountModel
