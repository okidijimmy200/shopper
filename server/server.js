import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'
import bidding from './controllers/bidding.controller.js'

// Connection URL
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

/**we will
update the code in server.js to get a reference to the HTTP server that our Express
app is using to listen for requests from clients */
const server =  app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})

bidding(server)
