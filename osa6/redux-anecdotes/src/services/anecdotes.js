import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  console.log(`createNew service: content = ${content}`)

  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const update = async (updateContent) => {
  console.log(`update service: content = ${updateContent}`)

  const newContent = {
    ...updateContent,
    votes: updateContent.votes + 1
  }
  const id = updateContent.id
  const response = await axios.put(`${baseUrl}/${id}`, newContent)
  return response.data
}

export default { getAll, createNew, update }