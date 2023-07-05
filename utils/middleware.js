const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('./logger')

const errorHandler = (error, req, res, next) => {
    //console.log(error.message)    
    logger.error(error.message)

    if(error.name=="ValidationError"){
      return res.status(400).json({error:error.message})
    }else if(error.name==='JsonWebTokenError'){
      return res.status(401).json({error:'token invalido'})
    }else if(error.name === 'TokenExpiredError'){
      console.log('pues aqui estamos')
      return res.status(401).json({error: 'token expired' })     
    }
    
    next(error)
}


 const tokenExtractor = (req, res, next) =>{
   
    const authorization = req.get('authorization')      
    if (authorization && authorization.startsWith('Bearer ')) {      
      //return authorization.replace('Bearer ', '')      
       req.token= authorization.replace('Bearer ', '')      
    }else {
       req.token = null
    }
    next()
 }

/*
 const userExtractor = async(req, res, next) =>{
   if(req.token){   
      try{
         const decodedToken = jwt.verify(req.token, process.env.SECRET) //usaremos el middleware tokenExtractor para sacar el token 
         if (!decodedToken.id) {
         return response.status(401).json({ error: 'usuario invalido' })
         }
         req.user = await User.findById(decodedToken.id) //pillamos el usuario cuya id se encuentra identificada en el token        
         next()
      }catch(error){
         next(error)
      }
   } 
 }
 */

module.exports={errorHandler, tokenExtractor}