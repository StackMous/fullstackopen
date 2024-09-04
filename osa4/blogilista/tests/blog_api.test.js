const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await helper.blogsInDb()
  assert.strictEqual(response.length, helper.initialBlogs.length)
})

test('the first blog is about React patterns', async () => {
  const response = await helper.blogsInDb()
  const contents = response.map(e => e.title)
  assert(contents.includes('React patterns'))
})

test('the id of blog is without underscore', async () => {
  const response = await helper.blogsInDb()
  // id's are found
  const contents = response.map(e => e.id)
  assert(contents[0] !== undefined)
  // _id's are NOT found
  const contents2 = response.map(e => e._id)
  assert(contents2[0] === undefined)
})

test('a new blog can be added ', async () => {
  const newBlog = {
    title: "Setämies SUPpaa",
    author: "Musta S. Naamio",
    url: "http://www.bengali-jungle.info/~urja-goes-SUPping.html",
    likes: 14003,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await helper.blogsInDb()
  const contents = response.map(r => r.title)
  assert.strictEqual(response.length, helper.initialBlogs.length + 1)
  assert(contents.includes('Setämies SUPpaa'))
})

test('blog with no likes given has 0 likes', async () => {
  // new blog without likes defined 
  const newBlog = {
    title: "gym teacher's philosophy",
    author: "P. K. Arjalainen",
    url: "http://www.loser.fi/~loving-tahko-pihkala.html",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await helper.blogsInDb()

  const likes = response.map(r => r.likes)
  assert.strictEqual(response.length, helper.initialBlogs.length + 1)
  console.log(`liketyksiä ${likes}`)
  console.log(`response len = ${response.length}, likes len ${likes.length}`)
  // last added blog did not have likes. Now it should have 0.
  assert(likes[response.length - 1] !== undefined)
})

test('blog with no title is rejected', async () => {
  const newBlog = {
    author: "K. Likkiotsikko",
    url: "http://www.is.fi/~oletko-aina-keittänyt-kahvin-väärin.html",
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await helper.blogsInDb()
  // new blog was not saved
  assert.strictEqual(response.length, helper.initialBlogs.length)
})

test('blog with no url is rejected', async () => {
  const newBlog = {
    title: "Oletko aina keittänyt kahvisi väärin?",
    author: "K. Likkiotsikko",
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await helper.blogsInDb()
  // new blog was not saved
  assert.strictEqual(response.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})