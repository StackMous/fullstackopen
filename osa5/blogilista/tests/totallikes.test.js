const { test, describe } = require('node:test')
const assert = require('node:assert')
const { favoriteBlog } = require('../utils/list_helper')

const totalLikes = require('../utils/list_helper').totalLikes
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes

const testBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

describe('Total likes', () => {
  test('of empty blog list is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('of one blog equals the likes of that blog', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
    assert.strictEqual(totalLikes(listWithOneBlog), listWithOneBlog[0].likes)
  })

  test('of big list is calulated correctly', () => {
    assert.strictEqual(totalLikes(testBlogs), 36)
  })
})

describe('Favorite blog', () => {
  const result = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  }
  test('of empty list is ... an empty object?', () => {
    assert.deepEqual(favoriteBlog([]), {})
  })

  test('is the one with most likes', () => {
    assert.deepEqual(favoriteBlog(testBlogs), result)
  })
})

describe('Most blogs', () => {
  const result = {
    author: 'Robert C. Martin',
    blogs: 3,
  }

  test('of empty list is ... empty object?', () => {
    assert.deepEqual(mostBlogs([]), {})
  })
  test('is the one with most blogs written', () => {
    assert.deepEqual(mostBlogs(testBlogs), result)
  })
})

describe('Most likes', () => {
  const result = {
    author: 'Edsger W. Dijkstra',
    likes: 17
  }

  test('of empty list is empty object', () => {
    assert.deepEqual(mostLikes([]), {})
  })
  test('is the one with most likes in all blogs altogether', () => {
    assert.deepEqual(mostLikes(testBlogs), result)
  })
})
