const User = require("../Models/userModel")
const jwt = require("jsonwebtoken")

/**
 * Controller for registering the user
 */
exports.register = async function (req, res) {
  const user = new User(req.body)
  user
    .register()
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      res.send(err)
    })
}

exports.login = async function (req, res) {
  const user = new User(req.body)
  user
    .login()
    .then(result => {
      const token = jwt.sign({ _id: result._id }, process.env.JWTSECRET)
      res.header("auth-token", token).send(token)
    })
    .catch(err => {
      res.send(err)
    })
}
