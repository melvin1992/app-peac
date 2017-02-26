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
  jhsLimits:
    AP_regular1:
      type: Number
    English_regular1:
      type: Number
    Filipino_regular1:
      type: Number
    Math_regular1:
      type: Number
    Science_regular1:
      type: Number
    AP_regular2:
      type: Number
    English_regular2:
      type: Number
    Filipino_regular2:
      type: Number
    Math_regular2:
      type: Number
    Science_regular2:
      type: Number
    AP_advanced:
      type: Number
    English_advanced:
      type: Number
    Filipino_advanced:
      type: Number
    Math_advanced:
      type: Number
    Science_advanced:
      type: Number
  shsLimits:
    English:
      type: Number
    Filipino:
      type: Number
    EarthLifeScience:
      type: Number
    PhysicalScience:
      type: Number
    Humanities:
      type: Number
    GeneralMath:
      type: Number
    StatisticsProbability:
      type: Number
    MediaInformationLiteracy:
      type: Number
    CutureSocietyPolitics:
      type: Number
    PersonalDevelopment:
      type: Number
    Philosophy:
      type: Number
    PhysicalEducation:
      type: Number




eventModel = mongoose.model('Events', EventSchema)
module.exports = eventModel
