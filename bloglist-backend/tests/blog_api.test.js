const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./list_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
}, 100000)

//  Test Cases

describe('When there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have property named id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  var authToken = ''
  beforeEach(async () => {
    const newUser = {
      username: 'root',
      password: 'password'
    }

    const user = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    authToken = `bearer ${user.body.token}`
  })
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Node.js testing with Jest',
      author: 'keshab manni',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 24
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(
      newBlog.title
    )
  })

  test('a valid blog with missing/wrong token will not be added', async () => {
    const newBlog = {
      title: 'Node.js testing with Jest',
      author: 'keshab manni',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 24
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer wrongtoken')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(
      newBlog.title
    )
  })

  test('if likes property is missing from request, it will default to value 0', async () => {
    const newBlogWithoutLikes = {
      title: 'Mongoose scheme property default values',
      author: 'Biraj Bhatta',
      url: 'http://www.u.arizona.edu/~rubinson/cop'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(
      newBlogWithoutLikes.title
    )

    const blogExists = await Blog.find({ 'title': newBlogWithoutLikes.title })
    expect(blogExists[0].likes).toBe(0)

  })

  test('blog without title or url is not added', async () => {
    const blogWithoutTitle = {
      author: 'Nikhil Upreti',
      url: 'http://www.u.arizona.edu/~rubinson/cop',
      likes: 21
    }

    const blogWithoutUrl = {
      title: 'Mongoose scheme property default values',
      author: 'Biraj Bhatta',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(blogWithoutTitle)
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(blogWithoutUrl)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDB()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  var authToken = ''
  beforeEach(async () => {
    const newUser = {
      username: 'root',
      password: 'password'
    }

    const user = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    authToken = `bearer ${user.body.token}`
  })
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', authToken)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating a blog', () => {
  test('likes for blog post is updated', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate['likes'] = 333

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(
      blogToUpdate.title
    )

    const updatedBlogFromDB = await Blog.findById(blogToUpdate.id)
    expect(updatedBlogFromDB['likes']).toBe(blogToUpdate.likes)
  })
})
// Footer
afterAll(() => {
  mongoose.connection.close()
})