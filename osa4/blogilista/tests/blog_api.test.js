const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const { url } = require('node:inspector')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('when trying some basic tests', () => {
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

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    console.log(`blog to delete ${blogToDelete}`)
    console.log(blogsAtStart)
    console.log(blogToDelete)
    console.log(blogToDelete.id)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const contents = blogsAtEnd.map(r => r.title)
    assert(!contents.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[1]

    // Do not make a new object by new(), u stupid boy
    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1, // update likes by +1
    }
    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    // verify that id still matches and likes has been updated
    assert.strictEqual(result.body.likes, updatedBlog.likes) 
    assert.strictEqual(result.body.id, blogToUpdate.id)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'snippe',
      name: 'Nippe Saarinen',
      password: 'sallainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with a too short username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'mr',
      name: 'Mister Who',
      password: 'diipadaapa',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.text.includes('is shorter than the minimum allowed length'))
  })

  test('creation fails with a too short password', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'elwood',
      name: 'Sir Elwood',
      password: 'qw',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.text.includes('too short password'))
  })

})

after(async () => {
  await mongoose.connection.close()
})
