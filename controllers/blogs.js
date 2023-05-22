const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {  
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })


  
  blogsRouter.post('/', async (request, response) => {    
    
    let blog = request.body  
    if(!blog.hasOwnProperty('title') || !blog.hasOwnProperty('url')){
      response.status(400).send('Bad Request') //en caso de que no esten las pop
    }else{
      if (!blog.hasOwnProperty('likes')){   //en caso de que no este la prpiedad likes en el request, ponemos el likex a cero. 
        blog.likes= 0
      }
      const result = await new Blog(blog).save()
      response.status(201).json(result) //devuelve el contacto guardado.      
    }   
  })

  

  module.exports=blogsRouter