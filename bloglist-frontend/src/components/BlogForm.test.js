import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls submit handler', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const title_element = container.querySelector('#title')
  const author_element = container.querySelector('#author')
  const url_element = container.querySelector('#url')
  const sendButton = screen.getByText('create')

  await user.type(title_element, 'Checking blog form creation')
  await user.type(author_element, 'Bon Jovi')
  await user.type(url_element, 'https://bonjovi.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Checking blog form creation')
  expect(createBlog.mock.calls[0][0].author).toBe('Bon Jovi')
  expect(createBlog.mock.calls[0][0].url).toBe('https://bonjovi.com')
})