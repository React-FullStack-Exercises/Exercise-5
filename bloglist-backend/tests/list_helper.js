/* eslint-disable no-unused-vars */
const Blog = require('../models/blog')
const User = require('../models/user')

var _ = require('lodash')

const rootUserId = '63a2af9bc8335e4bdf65641e'
const initialBlogs = [
  {
    title: 'something to write for express',
    author: 'raja rani',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 7,
    user: rootUserId
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 1,
    user: rootUserId
  },
  {
    title: 'Node testing with supertest',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 2,
    user: rootUserId
  }
]

// helper functions

const dummy = ( blogs ) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  },0)
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev: current
  },0)

  return favoriteBlog
}

const mostBlogs = (blogs) => {
  var countBlogs = _.map(_.groupBy(blogs, 'author'), (blogList, author) => ({ 'author': author, 'blogs': blogList.length }))
  return countBlogs.reduce((max, current) => max.blogs > current.blogs ? max : current)
}

const mostLikes = (blogs) => {
  var countLikes = _.map(_.groupBy(blogs, 'author'), (blogList, author) => ({ 'author': author, 'likes': blogList.reduce((sum, blog) => sum + blog.likes,0) }))
  return countLikes.reduce((max, current) => max.likes > current.likes ? max : current)
}

// exercise 4.6 ->
const nonExistingId = async () => {
  const blog = new Blog({ name: 'anynomous', number: '00-00000000' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,

  initialBlogs,
  nonExistingId,
  blogsInDB,

  usersInDb
}