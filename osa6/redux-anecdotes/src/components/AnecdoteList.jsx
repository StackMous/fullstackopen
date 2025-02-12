import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({filter, anecdotes}) => {
    console.log(anecdotes)
    if ( filter === '') {
      return anecdotes
    }
    return anecdotes.filter(d => d.content.toLowerCase().includes(filter.toLowerCase()))
  })

  return(
    <div>
      { anecdotes.slice().sort((a, b) => ( b.votes - a.votes)).map(anecdote => (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => { 
              dispatch(voteAnecdote(anecdote))
              dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
              }
            }>vote</button>
          </div>
        </div>
      )
      )}
    </div>
  )
}

export default AnecdoteList