import { useParams } from 'react-router-dom'

const User = ({ users }) => {
  const id = useParams().id
  const user = users.find(u => u.id === id)
  console.log(`User: ${JSON.stringify(user)}`)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      {user && (
        <ul>
          {user.blogs.map(b => (
            <li key={b.id}>{b.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default User
