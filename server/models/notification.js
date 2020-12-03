const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  message: {type:String, required: true},
  post: {type:Array},
  date: {type:Number},
})

notificationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Notification', notificationSchema)