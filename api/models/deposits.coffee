mongoose = require 'mongoose'
Schema = mongoose.Schema

DepositSchema = new Schema
  userId:
    type: String
    required: true
  depositReferenceNo:
    type: String
    required: true
  depositImgUrl:
    type: String
    default: ''
  registrationCodes:
    type: [String]
    require: true
  status:
    type: String
    enum: ['pending','approved','declined']
    default: 'pending'
  date:
    type: Date
    default: Date.now

depositModel = mongoose.model('Deposits', DepositSchema)
module.exports = depositModel
