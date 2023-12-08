const express = require('express')
const router = require('./routes')
require("dotenv").config()
const app = express()
const port = process.env.PORT ?? 3000
app.use('/', router);
const server = app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})

module.exports = {
  app,
  server
};