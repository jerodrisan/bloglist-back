const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//las referencias ahora estan relacionadas en blog.js y en user.js
//The ids of the contacts are stored within the user document as an array of Mongo ids. The definition is as follows in array contacts
//Instalaremos para almacenar las passwordhass : 
//          npm install bcrypt
//Instalamos libreria para checkear que un campo es unico : en este caso username (unique: true)
//          npm install mongoose-unique-validator

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
      },
    name: String,
    passwordHash: String,
    blogs: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
        }
    ],
})
userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User