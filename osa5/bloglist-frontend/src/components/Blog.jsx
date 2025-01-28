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
    marginBottom: 5
  }
  //if (user) {
  //  console.log(`Adder of blog: ${JSON.stringify(user)}`)
  //  console.log(`Username: ${JSON.stringify(username)}`)
  //  console.log(JSON.stringify(user.username) === JSON.stringify(username))
  //}

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {" "}
        {blog.author} {" "}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {" "}
        {blog.author} {" "}
        <button onClick={toggleVisibility}>hide</button>
        <div> {blog.url} </div>
        <div>
          likes {blog.likes} {" "}
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