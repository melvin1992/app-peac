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
    type: Date
  email:
    type: String
    default: ''
  contactNo:
    type: String
    default: ''
  teachingYears:
    type: Number
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
    default: 1

participantModel = mongoose.model('Participants', ParticipantSchema)
module.exports = participantModel
