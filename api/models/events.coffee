mongoose = require 'mongoose'
Schema = mongoose.Schema

EventSchema = new Schema
  name:
    type: String
    required: true
  venue:
    type: String
    required: true
  eventDate:
    type: String
    required: true
  eventType:
    type: String
    enum: ['JHS INSET','JHS Orientation','SHS INSET','SHS Orientation']
    required: true
  eventYear:
    type: String
    required: true
  eventFee:
    type: Number
    required: true
  hours:
    type: Number
    default: 0
  limits:
    type: Number
    required: true
  region:
    type: [String]
    required: true
  province:
    type: [String]
    default: ['']
  deadline:
    type: Date
    require: true
  status:
    type: String
    enum: ['active','inactive','end']
    default: 'active'


eventModel = mongoose.model('Events', EventSchema)
module.exports = eventModel
