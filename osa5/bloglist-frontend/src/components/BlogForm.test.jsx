import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('write title here')
  const inputAuthor = screen.getByPlaceholderText('write author here')
  const inputUrl = screen.getByPlaceholderText('write url here')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'setamies suppaa...')
  await user.type(inputAuthor, 'Seta Mies')
  await user.type(inputUrl, 'www.setamies.fi')
  await user.click(sendButton)
  console.log(createBlog.mock.calls)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('setamies suppaa...')
  expect(createBlog.mock.calls[0][0].author).toBe('Seta Mies')
  expect(createBlog.mock.calls[0][0].url).toBe('www.setamies.fi')
  expect(createBlog.mock.calls[0][0].likes).toBe(0)
})
