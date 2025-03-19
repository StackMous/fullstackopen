import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const BlogView = ({ blogs, updateBlog, clickRemove, user, addComment }) => {
  const [newComment, setNewComment] = useState('')

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  console.log(`Single blog: ${JSON.stringify(blog)}`)

  const addLikes = () => {
    console.log(`Addlikes blog: ${JSON.stringify(blog)}`)
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
    })
  }

  const removeBlog = blog => {
    console.log(`removeBlog blog: ${JSON.stringify(blog)}`)
    clickRemove(blog)
  }

  const addNewComment = event => {
    event.preventDefault()
    const comments = blog.comments
    comments.push(newComment)
    addComment({
      ...blog,
      comments: comments,
    })
    setNewComment('')
  }

  if (!blog) return
  return (
    <div>
      <h2>
        {blog.title}
        {', '} {blog.author}
      </h2>
      <Link to={blog.url}>{blog.url}</Link>
      <div>
        {blog.likes} likes{' '}
        <button
          onClick={() => {
            addLikes(blog)
          }}>
          like
        </button>
      </div>
      <div>Added by {blog.user.name}</div>
      {user && JSON.stringify(blog.user.username) === JSON.stringify(user.username) && (
        <div>
          <button
            onClick={() => {
              console.log(`clickRemove blog: ${JSON.stringify(blog)}`)
              removeBlog(blog)
            }}>
            remove
          </button>
        </div>
      )}
      <h3>Comments</h3>
      <form onSubmit={addNewComment}>
        <div>
          <input value={newComment} onChange={event => setNewComment(event.target.value)} />{' '}
          <button type='submit'>add comment</button>
        </div>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={id + index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
