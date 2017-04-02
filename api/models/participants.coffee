mongoose = require 'mongoose'
Schema = mongoose.Schema

ParticipantSchema = new Schema
  transactionID:
    type: String
    required: true
  registrationCode:
    type: String
  userID:
    type: String
    required: true
  schoolID:
    type: String
    require: true
  eventID:
    type: String
    required: true
  eventType:
    type: String
    required: true
  title:
    type: String
    default: ''
  firstName:
    type: String
    default: ''
  middleName:
    type: String
    default: ''
  lastName:
    type: String
    default: ''
  suffix:
    type: String
    default: ''
  gender:
    type: String
    default: ''
  birthdate:
    type: String
  email:
    type: String
    default: ''
  contactNo:
    type: String
    default: ''
  teachingYears:
    type: Number
  licenseStatus:
    type: String
  licenseNumber:
    type: String
  licenseExpiry:
    type: String
  certificateDate:
    type: String
  designation:
    type: String
  learningArea:
    type: String
  certificateUrl:
    type: String
    default: ''
  presentHours:
    type: Number
    default: 0
  status:
    type: Number
    enum: [1,0]
    default: 0
  claimed:
    type: Number
    enum: [1,0]
    default: 0

participantModel = mongoose.model('Participants', ParticipantSchema)
module.exports = participantModel
