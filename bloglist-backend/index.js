/* eslint-disable no-unused-vars */
const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const { info, error } = require('./utils/logger')

const server = http.createServer(app)

// Run server
server.listen(config.PORT, () => {
  info(`Blog server running on the port ${config.PORT}`)
})
