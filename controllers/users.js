
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
    //const users = await User.find({}) //si queremos que salga la relacion por ids
    const users = await User.find({}).populate('blogs')  // si queremos que se vea la relacion por un array usamos populate
    //const users = await User.find({}).populate('blogs', { title: 1, author: 1 })    //si queremos que salgan solo los campos title y author
    response.json(users)
  })


usersRouter.post('/', async (request, response) => {

  const { username, name, password } = request.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})





module.exports = usersRouter