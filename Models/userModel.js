const bcrypt = require("bcryptjs")
const Mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const { registerValidate, loginValidate } = require("./validation")

let User = function (data) {
  this.data = data
  this.errors = []
}

const Schema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  firstName: {
    type: String,
    required: true,
    max: 255
  },
  lastName: {
    type: String,
    required: true,
    max: 255
  },
  email: {
    type: String,
    required: true,
    max: 255
  },
  password: {
    type: String,
    required: true,
    max: 1024
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

const model = Mongoose.model("User", Schema)

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    /**
     * Checking for validation errors
     * and rejecting if there are any
     * and sending back the errors
     */

    const { error } = registerValidate(this.data)
    if (!error) {
      /**
       * Checking for already registered email and username
       */
      const usernameExists = await model.findOne({ username: this.data.username })
      if (!usernameExists) {
        const emailExists = await model.findOne({ email: this.data.email })
        if (emailExists) {
          this.errors.push("This email is already taken")
        }
      } else {
        this.errors.push("This username already exists")
      }
    } else {
      this.errors.push(error.details[0].message)
    }
    /**
     * Checking for errors
     * If there are any reject with the errors
     * If there are not any errors then save the data in the database
     */
    if (this.errors.length) {
      reject(this.errors)
    } else {
      /**
       * Generating salt and the hashed password
       */
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(this.data.password, salt)
      const newUser = new model({
        username: this.data.username,
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
        password: hashedPassword
      })
      try {
        const savedUser = await newUser.save()
        resolve("saved")
      } catch (e) {
        reject(e)
      }
    }
  })
}

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    /**
     * Validating values
     */
    const { error } = loginValidate(this.data)
    /**
     * checking for any errors
     * If there are not then sending back the user ID
     */
    if (error) {
      this.errors.push(error.details[0].message)
      reject(this.errors)
    } else {
      model
        /**
         * Querying database for the username
         */
        .findOne({ username: this.data.username })
        .then(attemptedUser => {
          /**
           * Comparing passwords
           */
          if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
            resolve(attemptedUser._id)
          } else {
            this.errors.push("Invalid username/password")
            reject(this.errors)
          }
        })
        .catch(e => {
          reject(e)
        })
    }
  })
}

module.exports = User
