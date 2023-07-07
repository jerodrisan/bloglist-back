//instalamos dependencia para generar JSON web tokens:
//        npm install jsonwebtoken

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')


loginRouter.post('/', async (request, response) => {

    const { username, password } = request.body  
    const user = await User.findOne({ username })
    const passwordCorrect = user === null ? false  : await bcrypt.compare(password, user.passwordHash)  
    if (!(user && passwordCorrect)) {
      return response.status(401).json({error: 'invalid username or password'})
    }  
    const userForToken = {
      username: user.username,
      id: user._id,
    } 
    //hay que establecer en el archivo .env la variable SECRET, una vez expira el token hay que solicitar otro       
    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "24h"}) //ponemos el tiempo que queramos ej: expiresIn: "24h". El tiempo viene en segundos
    //console.log('userfortoken',userForToken, token)
    response
      .status(200)
      .send({ token, username: user.username, name: user.name, userid:user._id })
  })
  
  module.exports = loginRouter

