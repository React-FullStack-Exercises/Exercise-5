import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Blog from './components/Blog'
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

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const removeNotification = () => {
    setTimeout(() => {
      setNotification({message: '', type: ''})
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
      setNotification({message: 'Successfully logged in', type: 'success'})
    } catch (exception) {
      setNotification({message: 'Wrong username or password', type: 'error'})
    }
  }

  const handleLogout = async (event) => {
    if (user) {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      setUser(null)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const blogObject = {
        title: title,
        author: author,
        url: url
      }
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotification({message: `a new blog ${title} by ${author} added`, type: 'success'})
    } catch (Exception) {
      setNotification({message: 'blog not created', type: 'error'})
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password <input type='password' value={password} name='Password' onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title: <input value={title} onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        author: <input value={author} onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
        url: <input value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type='submit'>create</button>
    </form>
  )

  return (
    <div>
      <h1>Blog App</h1>

      <Notification notification={notification} removeNotification={removeNotification}/>
      {user === null ?
        <div>
          <h2>Log in to application</h2>
          {loginForm()}
        </div> :
        <div>
          <h2>Blogs</h2>
          <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
          <h2>create new</h2>
          {blogForm()}
          {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
        </div>
      }

      <Footer />
    </div>
  )
}

export default App
