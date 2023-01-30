describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3006/api/testing/reset')
    const user = {
      name: 'Keshab Manni',
      username: 'keshab',
      password: 'keshab'
    }
    cy.request('POST', 'http://localhost:3006/api/users', user)
    cy.visit('http://localhost:3006')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('keshab')
      cy.get('#password').type('keshab')
      cy.get('#login-button').click()

      cy.contains('Keshab Manni logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('Someone')
      cy.get('#password').type('worng')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Keshab Manni logged-in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'keshab', password: 'keshab' })
    })

    it('A blog can be created', function() {
      cy.get('#create-blog-button').click()
      cy.get('#title').type('a blog created with cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.com')

      cy.get('#submit-blog-button').click()
      
      cy.contains('a blog created with cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: 'Rj', url:'www.firstblog.com', likes:'1' })
      })
      it('Users can like blog', function() {
        cy.contains('first blog')
          .contains('view').click()
          .parent().parent().as('theBlog')
        
        cy.get('@theBlog').contains('like').click()
        
        cy.get('@theBlog').contains('likes 2')
      })

      it('User who created a blog can delete it', function () {
        cy.contains('first blog')
          .contains('view').click()
          .parent().parent().as('theBlog')
        cy.get('@theBlog').contains('remove').click()

        cy.get('html').should('not.contain', 'first blog')
      })

    })

    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'The title with average likes', author: 'Rj', url:'www.blog.com', likes:'12' })
        cy.createBlog({ title: 'The title with most likes', author: 'JK', url:'www.blog.com', likes:'76' })
        cy.createBlog({ title: 'The title with least likes', author: 'SK', url:'www.blog.com', likes:'5' })
      })

      it.only('blogs are sorted according to likes', function () {
        cy.get('.blog').eq(0).should('contain', 'The title with most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with average likes')
        cy.get('.blog').eq(2).should('contain', 'The title with least likes')
      })
    })
  })
})