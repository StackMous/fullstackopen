import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('') 
  const [newAuthor, setNewAuthor] = useState('') 
  const [newUrl, setNewUrl] = useState('') 
  const [newError, setNewError] = useState(null)
  const [newMessage, setNewMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

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
  
  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
  
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        showNotification(`A new blog ${newTitle} by ${newAuthor} added`)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setTimeout(() => {
          setNewError(null)
        }, 5000)

      })
      .catch(error => {
        showError(`Somethjing happened`)
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

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification message={newMessage} />
      <Error message={newError} />
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>      
    </div>
  )

  const logoutForm = () => (
    <div>
      <form onSubmit={handleLogout}>
        <p>{user.name} logged in <button type="submit">logout</button></p>
      </form>      
    </div>
  )

  const blogsForm = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const createBlogForm = () => (
    <form onSubmit={addBlog}>
      <label>title: 
        <input
          value={newTitle}
          onChange={handleTitleChange}
        />
      </label>
      <br/>
      <label>author: 
        <input
          value={newAuthor}
          onChange={handleAuthorChange}
        />
      </label>
      <br/>
      <label>url: 
        <input
          value={newUrl}
          onChange={handleUrlChange}
        />
      </label>
      <br/>
      <button type="submit">create</button>
    </form>  
  )

  return (
    <div>
      {!user && loginForm()}
      {user && <div>
          <h2>blogs</h2>
          <Notification message={newMessage} />
          <Error message={newError} />
          {logoutForm()}
          {createBlogForm()}
          {blogsForm()}
        </div>
      }
    </div>
  )
}

export default App