const listHelper = require('../tests/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithZeroBlog = []
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
  const listWithMoreBlog = [
    {
      _id: '5a422aa71b54a676234d17f2',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f0',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 13,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f1',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 2,
      __v: 0
    }
  ]
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listWithZeroBlog)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMoreBlog)
    expect(result).toBe(22)
  })
})

describe('favorite blog', () => {
  const listWithMoreBlog = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 7
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 11
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 2
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
  ]

  test('favorite blog is', () => {
    const result = listHelper.favoriteBlog(listWithMoreBlog)
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
    expect(result).toEqual(expected)
  })
})

describe('blogs summery', () => {
  const blogs = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 7
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 11
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Rene',
      likes: 2
    },
    {
      title: 'Canonical string reduction',
      author: 'Rene',
      likes: 8
    },
    {
      title: 'Canonical string reduction',
      author: 'Rene',
      likes: 12
    }
  ]
  test('most blogs by author ', () => {
    const result = listHelper.mostBlogs(blogs)

    const expected = {
      author: 'Rene',
      blogs: 3
    }

    expect(result).toEqual(expected)
  })

  test('most likes by author', () => {
    const result = listHelper.mostLikes(blogs)

    const expected = {
      author: 'Rene',
      likes: 22
    }

    expect(result).toEqual(expected)
  })
})
