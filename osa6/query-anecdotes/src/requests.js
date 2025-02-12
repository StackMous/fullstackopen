import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = newAnecdote => {
  try {
    console.log(newAnecdote)
    return axios.post(baseUrl, newAnecdote).then(res => res.data)  
  } catch (error) {
    console.log(error.message)
    return error
  }
}

export const updateAnecdote = updatedAnecdote =>
  axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)