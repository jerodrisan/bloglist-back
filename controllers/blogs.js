const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async(request, response) => {     

    //const blogs = await Blog.find({})
    const blogs = await Blog.find({}).populate('user', { username: 1, name:1 }) //en este caso usamos en el esquema 
    response.json(blogs)
  })



  /*Ejemplo de post de un blog 
  {
    "title":  "third blob via HTTP adsaf",
     "author": "pepe perez",
     "url":    "www.as.com",
     "likes": 10 ,
     "userId": "646e575d5eb733b256be8d67"     //id del usuario que creo el blog
  }
  */
  blogsRouter.post('/', async (request, response) => {    

    let body = request.body  
    if(!body.hasOwnProperty('title') || !body.hasOwnProperty('url')){
      response.status(400).send('Bad Request') //en caso de que no esten las pop
    }else{ 
      const user = await User.findById(body.userId) //pillamos el usuario cuya id en el post corresponde a userId
      const blog = new Blog({
        title:body.title,
        author:body.author,
        url:body.url,        
        user:user.id
      })
      blog.likes = !body.hasOwnProperty('likes') ? 0 : body.likes      //en caso que no este la propiedad likes, ponemos likes a cero

      const savedBlog = await new Blog(blog).save()//guardamos el blog 
      user.blogs = user.blogs.concat(savedBlog._id) //metemos la id del blog en el usuario y lo guardamos
      await user.save()
      response.status(201).json(savedBlog) //devuelve el contacto guardado.      
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