const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const jwt = require('jsonwebtoken')
const User = require('../models/user')


//  GET
blogsRouter.get('/', async (request, response) => {
  const decodedUser = request.user
  if(!decodedUser.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)

})

//  POST
blogsRouter.post('/', async (request, response) => {
  const body = new Blog(request.body)

  const decodedUser = request.user

  if(!decodedUser.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedUser.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// DELETE
blogsRouter.delete('/:id', async (request, response) => {

  const decodedUser = request.user
  if(!decodedUser.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById( request.params.id )
  if(!blog) {
    return response.status(400).json({
      error: 'blog does not exist'
    })
  }

  if (blog.user.toString() !== decodedUser.id.toString()) {
    return response.status(401).json({
      error: 'you are not authorized to delete this blog'
    })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// PUT
blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })
  response.status(204).json(updatedBlog)
})

module.exports = blogsRouter