
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jsonFormatter = require('..//utils/formatter')


//Obtencion de todos los usuarios con sus respectivos blogs cada uno 
usersRouter.get('/', async (request, response) => {
    //const users = await User.find({}) //si queremos que salga la relacion por ids
    const users = await User.find({}).populate('blogs')  // si queremos que se vea la relacion por un array usamos populate
    //const users = await User.find({}).populate('blogs', { title: 1, author: 1 })    //si queremos que salgan solo los campos title y author
    response.json(users)
    //si lo queremos formateado y solo para ver en el back 
    //let str = jsonFormatter(users)    
    //response.send(str)    
  })




//Nuevo usuario:
usersRouter.post('/', async (request, response, next) => {

  const { username, name, password } = request.body

  if(!(request.body).hasOwnProperty('password') || password ==='' ) {
      response.status(400).json({error:"empty password or missing password"})
  }else {
    if(password.length<=3){
      response.status(400).json({error:"password lengght must be more than 3 length"})
    }else{      
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)    
      const user = new User({
        username,
        name,
        passwordHash,
      })
      try{
        const savedUser = await user.save()
        response.status(201).json(savedUser)
      }catch(error){       
        next(error)
      } 
    }
  }
 
})





module.exports = usersRouter