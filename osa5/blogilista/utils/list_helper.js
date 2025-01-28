
const logger = require('./logger')

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}
  const chosen = blogs.reduce((prev, curr) => prev.likes > curr.likes ? prev : curr)
  return {
    'title': `${chosen.title}`,
    'author': `${chosen.author}`,
    'likes': chosen.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const authors = blogs.map(b => b.author)
  //  Michael Chan,Edsger W. Dijkstra,Edsger W. Dijkstra,Robert C. Martin,Robert C. Martin,Robert C. Martin
  // ["Michael Chan","Edsger W. Dijkstra","Edsger W. Dijkstra","Robert C. Martin","Robert C. Martin","Robert C. Martin"]

  let countPerAuthor = authors.reduce((count, author) => {
    logger.info(`author ${author}`)
    count[author] = (count[author] || 0) + 1
    logger.info(`count per this author ${count[author]}`)
    return count
  }, {})
  //console.log(countPerAuthor)
  //# { 'Michael Chan': 1, 'Edsger W. Dijkstra': 2, 'Robert C. Martin': 3 }
  //# {"Michael Chan":1,"Edsger W. Dijkstra":2,"Robert C. Martin":3}

  let maxCount = 0
  let authorWithMaxCount = {}
  for (const [key, value] of Object.entries(countPerAuthor)) {
    if (value > maxCount) {
      maxCount = value
      authorWithMaxCount.author = key
      authorWithMaxCount.blogs = value
    }
    logger.info(`Key: ${key}, Value: ${value}`)
  }

  return authorWithMaxCount
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const likesPerAuthor = blogs.reduce((likes, blog) => {
    let author = blog.author
    logger.info(`author ${author}`)
    logger.info(`likes ${blog.likes}`)

    likes[author] = (likes[author] || 0) + blog.likes
    logger.info(`likes per this author ${likes[author]}`)
    return likes
  }, {})
  console.log(likesPerAuthor)

  let maxLikes = 0
  let authorWithMaxLikes = {}
  for (const [key, value] of Object.entries(likesPerAuthor)) {
    if (value > maxLikes) {
      maxLikes = value
      authorWithMaxLikes.author = key
      authorWithMaxLikes.likes = value
    }
    logger.info(`Key: ${key}, Value: ${value}`)
  }
  return authorWithMaxLikes
}

const dummy = () => {
  return 1
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}