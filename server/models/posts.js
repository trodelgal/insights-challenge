const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {type:String, required: true},
  content: {type:String},
  author: {type:String},
  date: {type:Number},
  views: {type:String},
  labels:{type:Array},
})

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Post', postSchema)