const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://StackMous:${password}@stackmouscluster.naieb.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=StackMousCluster`
// or this? `mongodb+srv://StackMous:${password}@stackmouscluster.naieb.mongodb.net/noteApp?retryWrites=true&w=majority`
//  `mongodb+srv://StackMous:${password}@stackmouscluster.naieb.mongodb.net/noteApp?retryWrites=true&w=majority&appName=StackMousCluster`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })

  const Note = mongoose.model('Note', noteSchema)

  const note = new Note({
    content: 'Eisssaaatana',
    important: true,
  })

  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })

  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
})