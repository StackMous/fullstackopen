const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.put('/:id', async (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedNote)
})

notesRouter.post('/', async (request, response) => {
  const body = request.body
  console.log('tarvo body')
  console.log(body)

  console.log(`tarvo userId ${body.userId}`)
  const user = await User.findById(body.userId)
  //const user = User.findById(body.userId)
  console.log(`tarvo user ${user}`)

  const note = new Note({
    content: body.content,
    //important: body.important || false,
    important: body.important === undefined ? false : body.important,
    user: user._id
  })
  console.log(`tarvo new note `)
  console.log(note)


  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})

notesRouter.get('/:id', async (request, response) => {
  const note =await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = notesRouter