import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { getAll, create, update, remove, comment } from './services/blogs'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { Table } from 'react-bootstrap'

//import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import { useNotify } from './NotificationContext'
import { useUserDispatch, useUserValue } from './UserContext'
import Users from './components/Users'
import User from './components/User'
import axios from 'axios'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)
  const [users, setUsers] = useState()

  const userValue = useUserValue()
  const userDispatch = useUserDispatch()
  const user = userValue
  const queryClient = useQueryClient()

  const getUsers = async () => {
    const baseUrl = '/api/users'
    const response = await axios.get(baseUrl)
    const users = response.data
    setUsers(users)
  }

  useEffect(() => {
    getUsers()
  }, [])

  console.log(`LISTOFUSERS: ${JSON.stringify(users)}`)

  const newBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: err => {
      console.log(JSON.parse(JSON.stringify(err)))
      notifyWith('Adding blog failed!')
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: error => {
      notifyWith('Updating likes failed!')
    },
  })

  const removeMutation = useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const commentBlogMutation = useMutation({
    mutationFn: comment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const notifyWith = useNotify()
  const blogFormRef = useRef()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
  })
  console.log(JSON.parse(JSON.stringify(result)))

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  const blogs = result.data

  //console.log(`${user} logged in`)
  //console.log(`User: ${JSON.stringify(user)} logged in`)

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      notifyWith(`Welcome ${username}`)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith('wrong username or password')
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    notifyWith(`logged out ${user.username}`)
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      userDispatch({ type: 'CLEAR_USER' })
      setLoginVisible(false)
    } catch (exception) {
      notifyWith('failed to log out')
    }
  }

  const addBlog = blog => {
    newBlogMutation.mutate({ ...blog, user })
    blogFormRef.current.toggleVisibility()
  }

  const updateBlog = updateBlogData => {
    console.log(`updateBlog: ${JSON.stringify(updateBlogData)}`)
    updateBlogMutation.mutate(updateBlogData)
  }

  const addComment = blogObject => {
    console.log(`addComment: ${JSON.stringify(blogObject)}`)
    commentBlogMutation.mutate(blogObject)
  }

  const handleRemove = async blog => {
    console.log(`In App() => handleRemove blog: ${JSON.stringify(blog)}`)
    try {
      if (window.confirm(`Remove blog: ${blog.title.toString()}, ${blog.author.toString()}?`)) {
        removeMutation.mutate(blog.id)
      }
    } catch (error) {
      notifyWith('failed to remove')
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }
    console.log(
      `hideWhenVisible = ${JSON.stringify(hideWhenVisible)}, showWhenVisible = ${JSON.stringify(
        showWhenVisible
      )}`
    )

    return (
      <div>
        <Notification />
        <div>
          <LoginForm
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
      </div>
    )
  }

  const blogsList = user => {
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5,
    }
    let name = null
    if (user) {
      name = user.username
    }

    return (
      <div>
        <Table striped>
          <tbody>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map((blog, index) => (
                <tr key={blog.id + index}>
                  <td>
                    <Link to={`/blogs/${blog.id}`}>
                      {blog.title}
                      {', '}
                      {blog.author}
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    )
  }

  const blogForm = () => {
    return (
      <div>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </div>
    )
  }

  const padding = {
    padding: 5,
  }

  return (
    <div className='container'>
      <Router>
        <div>
          <Link style={padding} to='/'>
            blogs
          </Link>
          <Link style={padding} to='/users'>
            users
          </Link>
          {user ? (
            <em>
              {user.name} logged in <button onClick={handleLogout}>logout</button>
            </em>
          ) : (
            <Link style={padding} to='/login'>
              login
            </Link>
          )}
        </div>

        <Routes>
          <Route
            path='/users'
            element={user ? <Users user={user} users={users} /> : <Navigate replace to='/login' />}
          />
          <Route
            path='/users/:id'
            element={
              user ? (
                <div>
                  <h2>blogs</h2>
                  <Notification />
                  <User users={users} />
                </div>
              ) : (
                <Navigate replace to='/login' />
              )
            }
          />
          <Route
            path='/blogs/:id'
            element={
              <div>
                <h2>blogs</h2>
                <Notification />
                <BlogView
                  blogs={blogs}
                  updateBlog={updateBlog}
                  clickRemove={handleRemove}
                  user={userValue}
                  addComment={addComment}
                />
              </div>
            }
          />

          <Route
            path='/'
            element={
              <div>
                <h2>blogs</h2>
                {!user && <div>{blogsList()}</div>}
                {user && (
                  <div>
                    <Notification />
                    {blogForm()}
                    {blogsList(user)}
                  </div>
                )}
              </div>
            }
          />
          <Route
            path='/login'
            element={!user ? <div>{loginForm()}</div> : <Navigate replace to='/' />}
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
