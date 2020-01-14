const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')

const app = express()

const { SERVER_PORT, DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env

mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(express.json())
app.use(routes)

app.listen(SERVER_PORT)

