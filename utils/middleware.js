
const errorHandler = (error, req, res, next) => {

    console.log(error.message)
    if(error.name=="ValidationError"){
        return res.status(400).json({error:error.message})
    }
    next(error)
}

module.exports={errorHandler}