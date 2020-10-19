const config = {
    //env: To differentiate between development and production modes
  env: process.env.NODE_ENV || 'development',
  //port: To define the listening port for the server
  port: process.env.PORT || 8080,
   //jwtSecret: The secret key to be used to sign JWT
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
   //mongoUri: The location of the MongoDB database instance for the project
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/mernproject',
  stripe_connect_test_client_id: 'YOUR_stripe_connect_test_client',
  stripe_test_secret_key: 'YOUR_stripe_test_secret_key',
  stripe_test_api_key: 'YOUR_stripe_test_api_key'
}

export default config

// // These variables will give us the flexibility to change values from a single file and use
// // it across the backend code

