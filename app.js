/**
 * Importing modules
 */
const express = require("express")
const app = express()
const router = require("./router")

/**
 * middlewares
 */
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/", router)

/**
 * exporting app
 */
module.exports = app
