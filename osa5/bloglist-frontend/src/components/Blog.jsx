import { useState } from 'react'

const Blog = ({ blog, user, clickLike, username, clickRemove }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  console.log(`Blog title: ${blog.title}`)

  if (!blog.title) return // Don't show empty blog
  else return (
    <div style={blogStyle} data-testid="blog">
      {blog.title} {' '}
      {blog.author} {' '}
      <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
      <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      <div style={showWhenVisible} className="togglableContent">
        <div> {blog.url} </div>
        <div>
          likes {blog.likes} {' '}
          <button onClick={() => {
            clickLike(blog)
          }}
          >like</button>
        </div>
        {user && <div>
          {user.name}
        </div>
        }
        {user && (JSON.stringify(user.username) === JSON.stringify(username)) && <div>
          <button onClick={() => clickRemove(blog)}>remove</button>
        </div>}
      </div>
    </div>
  )
}

export default Blog