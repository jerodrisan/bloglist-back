const blogsRouter = require('express').Router()
const jsonFormatter = require('../utils/formatter')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async(request, response) => {     

    //const blogs = await Blog.find({})
    const blogs = await Blog.find({}).populate('user', { username: 1, name:1 }) //en este caso usamos en el esquema 
    //Sin salida formateada y para uso en el front:
    response.json(blogs)    
    //Si queremos ver la salida formateada y sin poder usar en el front:    
    //let str = jsonFormatter(blogs)    
    //response.send(str)    
  })


  //devolucion de los blogs de un usuario determinado (no sale)
  blogsRouter.get('/:username', async(request, response)=>{ 
    const username = request.params.username
    console.log(username)
    const blogs = await Blog.find({"user.username":"root"})
    console.log(blogs)
    response.json(blogs)

  })



  //comprobacion de token expirado o invalido
  blogsRouter.get('/:token', async(request, response) => {
      const token = request.params.token
      console.log('this is the token ', token)
      try{
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) {         
          return response.json({ error: 'usuario invalido' })
        }      
        const user = await User.findById(decodedToken.id) //pillamos el usuario cuya id se encuentra identificada en el token  
        console.log(user)
        return response.json(user)

      }catch(error){      
          return response.json({error: error.name })      
      } 
  })
  

  
  const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  } 
  /*Ejemplo de post de un blog 
  {
    "title":  "third blob via HTTP adsaf",
     "author": "pepe perez",
     "url":    "www.as.com",
     "likes": 10     
  }
  */
  blogsRouter.post('/', async (request, response,next ) => {    
   
    let body = request.body  
    if(!body.hasOwnProperty('title') || !body.hasOwnProperty('url')){
      response.status(400).send('Bad Request') //en caso de que no esten las props
    }else{ 
      try{
       // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET) //En caso de usar la funcion getTokenFrom
        const decodedToken = jwt.verify(request.token, process.env.SECRET) //usaremos el middleware tokenExtractor para sacar el token 
        if (!decodedToken.id) {         
          return response.status(401).json({ error: 'usuario invalido' })
        }      
        const user = await User.findById(decodedToken.id) //pillamos el usuario cuya id se encuentra identificada en el token      

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
     }catch(error){
        console.log('este es el error',error)
        next(error)//sacamos el error del JsonWebTokenError en caso de que sea erroneo
      }
    }   
  })




  //Solo el usuario que añadio el blog, puede borrarlo, por lo tanto:
  //1. Nos logamos como usuario registrado y obtenemos el token (solo hay dos usuarios registrados, pepe y root)
  //2. Ponemos el token en la cabecera en Authorized
  //3. POnemos la id del blog que queremos borrar y mandamos el DELETE 
  blogsRouter.delete('/:id', async (request, response, next)=>{    
    
    try{      
      const decodedToken = jwt.verify(request.token, process.env.SECRET)   
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'usuario invalido' }) 
      }         
      const userId = decodedToken.id //sacamos la id del usuario que ha iniciado la sesion .       
      const user = await User.findById(userId)  //devuelve solo las ids            
      const userBlogs = user.blogs.map(blog=>blog.toJSON()) //pasamos las ids de objetos a strings       
      if(userBlogs.find(item=>item===request.params.id)){        //Borramos el blog        
        try{
          await Blog.findByIdAndRemove(request.params.id)
          response.status(204).end()
        }catch(error){
            console.log(error)
        }      
      }else{
        console.log('blog no encontrado')
      }                
    }catch(error){  //sacamos el error del JsonWebTokenError en caso de que sea erroneo
      next(error)    
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


  /* Esto iria en carpeta de middleware
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}
}*/


  
  

  module.exports=blogsRouter