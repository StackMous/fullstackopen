const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  console.log(`usersRouter post: user ${username} name ${name} pw ${password}`)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  console.log(`savedUser success`)

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 })
  response.json(users)
})

module.exports = usersRouter