import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Hidden & Visible', () => {
  const blog = {
    title: 'Kapteenin terveiset',
    author: 'Kapu UkrainApu',
    url: 'https://ukrainapu.fi',
    likes: 999,
  }
  const theuser = {
    user: 'Kapu',
    name: 'Blog Adder',
  }
  const mockHandler = vi.fn()
  let container

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={theuser} clickLike={mockHandler} username={null} clickRemove={null}>
      </Blog>
    ).container
  })

  test('renders title', async () => {
    screen.debug()
    expect(screen.getByText('Kapteenin terveiset', { exact: false })).toBeInTheDocument()
  })

  test('at start the hidden fields are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('clicking the button shows blogs details', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
    expect(screen.getByText('https://ukrainapu.fi', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('likes 999', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Blog Adder', { exact: false }))

  })

})

test('Clicking like twice shows two clicks', async () => {
  const blog = {
    title: 'Kapteenin terveiset',
    author: 'Kapu UkrainApu',
    url: 'https://ukrainapu.fi',
    likes: 999,
  }

  const mockHandler = vi.fn()
  render(
    <Blog blog={blog} user={null} clickLike={mockHandler} username={null} clickRemove={null}>
    </Blog>
  )
  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)
  console.log(mockHandler.mock.calls)
  screen.debug()
  expect(mockHandler.mock.calls).toHaveLength(2)
})
