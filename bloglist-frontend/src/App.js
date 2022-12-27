import { useState, useEffect, useRef } from 'react'

import Notification from './components/Notification'
import Footer from './components/Footer'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({
    message: '',
    type: ''
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const returnedBlogs = await blogService.getAll()
        returnedBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(returnedBlogs)
      } catch (exception) {
        if (exception.response.status === 401) {
          window.localStorage.removeItem('loggedBlogappUser')
          blogService.setToken(null)
          setUser(null)
          return handleNotification('session expired', 'error')
        }
        handleNotification('error while fetching blogs', 'error')
      }
    }
    fetchData()
  }, [])

  const handleNotification = (message, type) => {
    setNotification({ message: message, type: type })
    setTimeout(() => {
      setNotification({ message: '', type: '' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      handleNotification('Successfully logged in', 'success')
    } catch (exception) {
      handleNotification('Wrong username or password', 'error')
    }
  }


  const handleLogout = async () => {
    if (user) {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      setUser(null)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      handleNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
    } catch (exception) {
      if (exception.response.status === 401) {
        handleLogout()
        return handleNotification('Authorization error', 'error')
      }
      handleNotification('error creating new blog', 'error')
    }
  }

  const increaseLike = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      await blogService.update(id, changedBlog)
      setBlogs(blogs.map(b => b.id === id ? changedBlog : b))
    } catch (exception) {
      if (exception.response.status === 401) {
        handleLogout()
        return handleNotification('Authorization error', 'error')
      }
      setBlogs(blogs.filter(b => b.id !== id))
      handleNotification('the blog post was already deleted from database', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      handleNotification('blog deleted successfully', 'success')
    } catch (exception) {
      handleNotification('error while deleting blog', 'error')
    }
  }

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <h1>Blog App</h1>

      <Notification notification={notification} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          <h2>Blogs</h2>
          {blogs.map(blog => <Blog
            key={blog.id}
            blog={blog}
            handleLike={() => increaseLike(blog.id)}
            handleDelete={() => handleDelete(blog.id)} />)
          }
        </div>
      }
      <Footer />
    </div>
  )
}

export default App
