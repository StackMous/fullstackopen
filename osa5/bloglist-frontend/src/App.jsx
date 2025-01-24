import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newError, setNewError] = useState(null)
  const [newMessage, setNewMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      showNotification(`${username} logged in`)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showError('wrong username or password')
    }
  }
  
  const handleLogout = async (event) => {
    event.preventDefault()
    showNotification(`logging out ${username}`)
    try {
      window.localStorage.removeItem('loggedBlogappUser')
    } catch (exception) {
      showError('failed to log out')
    }
  }
  
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        //setBlogs(blogs.concat(returnedBlog))
        setBlogs(blogs.concat(returnedBlog, user))
      })
  }

  const showNotification = message => {
    setNewMessage(message)
    setTimeout(() => {
      setNewMessage(null)
    }, 3000)
  }

  const showError = message => {
    setNewError(message)
    setTimeout(() => {
      setNewError(null)
    }, 3000)
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <Notification message={newMessage} />
        <Error message={newError} />
        <div style={hideWhenVisible}>
            <button onClick={() => setLoginVisible(true)}>log in</button>
          </div>
          <div style={showWhenVisible}>
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
            <button onClick={() => setLoginVisible(false)}>cancel</button>
          </div>
      </div>
    )
  }

  const logoutForm = () => (
    <div>
      <form onSubmit={handleLogout}>
        <p>{user.name} logged in <button type="submit">logout</button></p>
      </form>      
    </div>
  )
  
  const blogsList = () => {
    // Miksi ihmeessä key tarvitsi "dummy" indexin, 
    // että warning "each child in the list should've unique key" katosi?
    return(
      blogs.map((blog,index) => 
        <Blog key={blog.id + index} blog={blog} user={blog.user}/> 
      )
  )}

  const blogForm = () => {
    return(
      <div>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm 
              createBlog={addBlog}
            /> 
          </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {!user && <div>
        loginForm() 
        blogsList()
        </div>
      }
      {user && <div>
          
          <Notification message={newMessage} />
          <Error message={newError} />
          {logoutForm()}
          {blogForm()}
          {blogsList()}    
        </div>
      }
      
    </div>
  )
}

export default App