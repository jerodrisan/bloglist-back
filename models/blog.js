const mongoose = require('mongoose');
// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
//Instalaremos npm install dotenv para guardar la direccion uri de la base de datos y la contraseña en un archivo .env.
//ver tambien en archivo env, el usuario y password de la base de datos .La  pasword creada para usuario de la base de datos ,no la contraseña de mongodb atlas
//No lo ponemos aqui para no subirlo a github

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })
  
  blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  module.exports = mongoose.model('Blog', blogSchema)



  