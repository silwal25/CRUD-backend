const express = require("express")
const router = express.Router()
const userController = require("./Controllers/userController")

/**
 * default path
 */
router.get("/", (req, res) => {
  res.send("Hello world")
})

/**
 * User related paths
 */
router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/create-post")

/**
 * Post related paths
 */

module.exports = router
