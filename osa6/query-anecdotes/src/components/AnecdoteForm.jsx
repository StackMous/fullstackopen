import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = ({anecdoteMutation}) => {
  const dispatch = useNotificationDispatch()
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    anecdoteMutation({ content, votes: 0})
    dispatch({type: "SHOW", value: `you added '${content}'`})
    setTimeout(() => {
      dispatch({type: "HIDE", value: ''})
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
