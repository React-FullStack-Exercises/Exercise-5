import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('renders title and author but not the url and likes', async () => {
  const blog = {
    title: 'Component testing done with react-testing-library',
    url: 'https://example.com',
    user: { name:'SK' },
    author: 'Martin L. King'
  }

  render(<Blog blog={blog}/>)

  // Renders by default
  const title_element = screen.getByText(
    'Component testing done with react-testing-library', { exact: false }
  )
  expect(title_element).toBeDefined()

  const author_element = screen.getByText('Martin L. King', { exact: false })
  expect(author_element).toBeDefined()

  // Doesn't render by default
  const url_element = await screen.findByText('https://example.com')
  expect(url_element).not.toBeVisible()

  const likes_element = await screen.findByText('likes')
  expect(likes_element).not.toBeVisible()
})

test('clicking the show button, url and number of likes are shown', async () => {
  const blog = {
    title: 'Component testing done with react-testing-library',
    url: 'https://example.com',
    user: { name:'SK' },
    author: 'Martin L. King'
  }

  render(<Blog blog={blog}/>)

  const user = userEvent.setup()
  const showButton = screen.queryByText('view')
  await user.click(showButton)

  const url_element = await screen.findByText('https://example.com')
  expect(url_element).toBeVisible()

  const likes_element = await screen.findByText('likes')
  expect(likes_element).toBeVisible()
})

test('clicking like button calls event handler', async () => {
  const blog = {
    title: 'Component testing done with react-testing-library',
    url: 'https://example.com',
    user: { name:'SK' },
    author: 'Martin L. King'
  }

  const mockLikeHandler = jest.fn()

  render(<Blog blog={blog} handleLike={mockLikeHandler} />)

  const user = userEvent.setup()
  const showButton = screen.queryByText('view')
  await user.click(showButton)

  const likeButton = screen.queryByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler.mock.calls).toHaveLength(2)
})