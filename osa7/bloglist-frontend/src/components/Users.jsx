import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Users = ({ user, users }) => {
  console.log(`Users: ${users}`)
  console.log(`User: ${JSON.stringify(user)}`)

  if (!users) return // Don't show empty users
  else
    return (
      <div>
        <h2>Users</h2>
        <Table striped>
          <tbody>
            <tr>
              <th>Blogs created</th>
            </tr>
            {users.map(u => (
              <tr key={u.id}>
                <Link to={`/users/${u.id}`}>{u.username}</Link>
                <td>{u.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
}

export default Users
