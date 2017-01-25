mongoose = require 'mongoose'
Schema = mongoose.Schema

AdminSchema = new Schema
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

adminModel = mongoose.model('Admins', AdminSchema)
module.exports = adminModel
