const { required } = require("joi")
const Joi = require("joi")

const registerValidate = data => {
  const Schema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    email: Joi.string().max(255).required().email(),
    password: Joi.string().min(6).max(50)
  })
  return Schema.validate(data)
}

const loginValidate = data => {
  const Schema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    password: Joi.string().required()
  })
  return Schema.validate(data)
}

module.exports.registerValidate = registerValidate
module.exports.loginValidate = loginValidate
