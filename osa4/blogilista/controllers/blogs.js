const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  if (!request.token.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
//  console.log(`token's id ${request.token.id}`)
//  console.log(`token's user ${request.user}`)
  if (body.title === undefined || body.url === undefined) {
    return response.status(400).end()
  } 
  else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    return response.status(201).json(savedBlog)  
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } 
  return response.status(401).json({ error: 'not allowed. user is not the owner' })
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  // Do not make a new object by new(), u stupid boy
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  console.log(`router, req param id${request.params.id}`)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  return response.status(200).json(updatedBlog)
})

module.exports = blogsRouter