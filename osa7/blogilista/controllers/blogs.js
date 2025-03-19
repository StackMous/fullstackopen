const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: 0,
      user: user._id,
    })
    const savedBlog = await blog.save()
    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
    console.log(`savedBlog ===> ${JSON.stringify(savedBlog)}`)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    return response.status(201).json(savedBlog)
  }
})

//api/blogs/:id/comments
blogsRouter.post('/:id/comments', async (request, response) => {
  const newBlog = request.body
  const newComment = newBlog.comments[newBlog.comments.length - 1]

  logger.info(`logger comment's body: ${JSON.stringify(newBlog)}`)
  logger.info(`logger comment's comment: ${JSON.stringify(newComment)}`)
  let id = request.params.id
  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(400).json({ error: 'blog not found' })
  }

  blog.comments.push(newComment)
  const updatedBlog = await blog.save()

  response.status(201).json(updatedBlog)
  //return response.status(201).json({ message: 'comment added' })
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  console.log(`blogs id ${request.params.id}`)
  logger.info(`logger blog's id: ${request.params.id}`)

  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }
  return response.status(401).json({ error: 'not allowed. user is not the owner' })
})

blogsRouter.get('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  //logger.info(`Get one blog, id: ${request.params.id}`)

  if (blog) {
    const returnedBlog = await blog.save().populate('user', { username: 1, name: 1 })
    response.json(returnedBlog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = request.user
  //logger.info('Is this working?!!!')

  // Do not make a new object by new(), u stupid boy
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes | 0,
  }
  console.log(`router, req param id${request.params.id}`)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  if (!updatedBlog) {
    requestLogger.error('blog not found')
    response.status(404).end()
  }

  await updatedBlog.populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  return response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
