const Mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

/**
 * Connecting to mongodb database
 */
Mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log(err)
  } else {
    console.log("Connected to database")
    module.exports = client
    const app = require("./app")
    app.listen(process.env.PORT)
  }
})
