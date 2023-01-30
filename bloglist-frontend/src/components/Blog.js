import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)
  const [toggleLabel, setToggleLabel] = useState('view')

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
    setToggleLabel(!visible ? 'hide': 'view')
  }

  const askDelete = () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleDelete()
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>{blog.title}, {blog.author}<button onClick={toggleVisibility}>{toggleLabel}</button></div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
        <button onClick={askDelete}>remove</button>
      </div>
    </div>
  )
}
export default Blog