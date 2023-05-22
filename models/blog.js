const mongoose = require('mongoose');
// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
//Instalaremos npm install dotenv para guardar la direccion uri de la base de datos y la contraseña en un archivo .env
/*
user:polirodriron
pass: dWfr082Q1o7WfACk  //pasword creada para usuario de la base de datos ,no la contraseña de mongodb atlas
*/

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })
  
  //metodo que usareoms posteriormente para recibir los datos tal y como queremos (ejm: blog.toJSON() )
  blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Blog', blogSchema)



  