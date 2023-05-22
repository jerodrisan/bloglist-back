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


  
  blogsRouter.delete('/:id', async (request, response)=>{
    try{
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }catch(exception){
      console.log(excepcion)
    }
  })


  blogsRouter.put('/:id', async(request, response)=>{

    const id = request.params.id
    const likes = request.body.likes
    const blogToUpdate = {likes}
    try{
      await Blog.findByIdAndUpdate(id, blogToUpdate,{ new: true, runValidators: true, context: 'query' })
      response.status(204).end()
    }catch(excepcion){
      console.log(excepcion)
    }
  })


  
  

  module.exports=blogsRouter