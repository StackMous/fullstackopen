import { useState } from 'react'

const BlogForm = ({ createBlog, user }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    console.log(`BlogFormissa: ${newTitle} ${newAuthor} ${newUrl}`)

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
      user: user,
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid='title'
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            placeholder='write title here'
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
          url:
          <input
            data-testid='url'
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            placeholder='write url here'
          />
        </div>
        <br />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm
