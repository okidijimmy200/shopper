import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import request from 'request'
import config from './../../config/config'
//e stripe module, it needs to be imported into the user controller file.
import stripe from 'stripe'

/**stripe instance needs to be initialized with the application's Stripe
secret key */
const myStripe = stripe(config.stripe_test_secret_key)
/**--errorHandler helper to respond to route
requests with meaningful messages when a Mongoose error occurs */
/**--lodash module is used when updating an existing user with changed values.  */

//When the Express app gets a POST request at '/api/users', it calls the create
// function we defined in the controller.

const create = async (req, res) => {
    /**new user with the user JSON object that's received in the POST
request from the frontend within req.body. */
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
    if (!user)
      return res.status('400').json({
        error: "User not found"
      })
/**If a matching user is found in the database, the user object is appended to the request
object in the profile key */
    req.profile = user
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}

/**The read function retrieves the user details from req.profile and removes
sensitive information, such as the hashed_password and salt values, before
sending the user object in the response to the requesting client */
const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

/**The list controller function finds all the users from the database, populates only the
name, email, created, and updated fields in the resulting user list, and then returns
this list of users as JSON objects in an array to the requesting client. */
const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let user = req.profile
    user = extend(user, req.body)
    user.updated = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
/**The remove function retrieves the user from req.profile and uses the remove()
query to delete the user from the database */
const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
 /**isSeller ensures that the current user is actually a seller—before creating the new product. */
const isSeller = (req, res, next) => {
  const isSeller = req.profile && req.profile.seller
  if (!isSeller) {
    return res.status('403').json({
      error: "User is not a seller"
    })
  }
  next()
}

/**The POST API call to Stripe takes the platform's secret key and the retrieved auth
code to complete the authorization. Then, it returns the credentials for the connected
account in body, which is then appended to the request body so that the user's details
can be updated in the next() call to the update controller method */
const stripe_auth = (req, res, next) => {
  request({
    url: "https://connect.stripe.com/oauth/token",
    method: "POST",
    json: true,
    body: {client_secret:config.stripe_test_secret_key,code:req.body.stripe, grant_type:'authorization_code'}
  }, (error, response, body) => {
    //update user
    if(body.error){
      return res.status('400').json({
        error: body.error_description
      })
    }
    req.body.stripe_seller = body
    next()
  })
}

/**We will create a new, or update an existing, Stripe Customer when the user places an
order after entering their credit card details */
/**will be called before the order
is created when our server receives a request to the create order API */
const stripeCustomer = (req, res, next) => {
  if(req.profile.stripe_customer){
      //update stripe customer
/**Once a Stripe Customer has been created, we can update
the Stripe Customer the next time a user enters credit card details for a new order */
      myStripe.customers.update(req.profile.stripe_customer, {
          source: req.body.token
      }, (err, customer) => {
        if(err){
          return res.status(400).send({
            error: "Could not update charge details"
          })
        }
/**Once the Stripe Customer has been successfully updated, we will add the Customer
ID to the order being created in the next() call */
        req.body.order.payment_id = customer.id
        next()
      })
  }else{
    /**The stripeCustomer controller method will check whether the current user already
has a corresponding Stripe Customer stored in the database, and then use the card
token received from the frontend to either create a new Stripe Customer or update the
existing one, as discussed in the following sections */
      myStripe.customers.create({
            email: req.profile.email,
            source: req.body.token
      }).then((customer) => {
/**If the Stripe Customer is successfully created, we will update the current user's data
by storing the Stripe Customer ID reference in the stripe_customer field. We will
also add this Customer ID to the order being placed so that it is simpler to create a
charge related to the order */
          User.update({'_id':req.profile._id},
            {'$set': { 'stripe_customer': customer.id }},
            (err, order) => {
              if (err) {
                return res.status(400).send({
                  error: errorHandler.getErrorMessage(err)
                })
              }
              req.body.order.payment_id = customer.id
              next()
            })
      })
  }
}

/**When a seller updates an order by processing the product that was ordered in their
shop, the application will create a charge on behalf of the seller on the customer's
credit card for the cost of the product ordered wch uses Stripe's create a charge API and needs
the seller's Stripe account ID, along with the buyer's Stripe Customer ID */
const createCharge = (req, res, next) => {
  if(!req.profile.stripe_seller){
/**If the seller has not connected their Stripe account yet, the createCharge method
will return a 400 error response to indicate that a connected Stripe account is
required */
    return res.status('400').json({
      error: "Please connect your Stripe account"
    })
  }
  /**To be able to charge the Stripe Customer on behalf of the seller's Stripe account, we
need to generate a Stripe token with the Customer ID and the seller's Stripe account
ID and then use that token to create a charge */
  myStripe.tokens.create({
    customer: req.order.payment_id,
  }, {
    stripeAccount: req.profile.stripe_seller.stripe_user_id,
  }).then((token) => {
      myStripe.charges.create({
        amount: req.body.amount * 100, //amount in cents
        currency: "usd",
        source: token.id,
      }, {
        stripeAccount: req.profile.stripe_seller.stripe_user_id,
      }).then((charge) => {
        next()
      })
  })
}

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  isSeller,
  stripe_auth,
  stripeCustomer,
  createCharge
}
