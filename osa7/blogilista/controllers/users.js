const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password.length < 3) {
    return response.status(400).send({ error: 'too short password' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  console.log('savedUser success')

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1 })
  response.json(users)
})

module.exports = usersRouter
