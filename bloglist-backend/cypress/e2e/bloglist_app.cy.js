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
})