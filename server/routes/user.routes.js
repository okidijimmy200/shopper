import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/users')
  .get(userCtrl.list) //Listing users with GET
  .post(userCtrl.create) //Creating a new user with POST

  // user route declarations that need to be protected with authentication and authorization.
router.route('/api/users/:userId')
  // --route to read user's information requires only authentication verification
  .get(authCtrl.requireSignin, userCtrl.read) //Fetching a user with GET
 // --route for update and delete requires both authentication and authorization
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)
/**This Stripe auth update API will receive a PUT request and initiate the POST API call to retrieve the
credentials from Stripe */
///////////////////////////////////////////////////////
/**A request to this route uses the stripe_auth controller method to retrieve the
credentials from Stripe and passes it to the existing user update method so that it can
be stored in the database */
  router.route('/api/stripe_auth/:userId')
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.stripe_auth, userCtrl.update)

router.param('userId', userCtrl.userByID)

export default router
