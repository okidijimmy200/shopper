import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'

const router = express.Router()

/**add a route to retrieve all the shops stored in the database when the server receives a GET request */
router.route('/api/shops')
  .get(shopCtrl.list)

router.route('/api/shop/:shopId')
  .get(shopCtrl.read)

//create shop API that will allow creating new shops in the database,
router.route('/api/shops/by/:userId')
/**POST route,will first ensure the requesting user is signed in and is also the authorized owner, in other words, it is the
same user associated with the :userId specified in the route param. */
//-----------------------------------------------------------------------------------------------------
/**The request to the create shop route will also verify that the current user is a seller
before creating a new shop with the shop data passed in the request. */
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isSeller, shopCtrl.create)
// GET request to retrieve all the shops created by a given user
//A GET request to this route will first ensure the requesting user is signed in and is also the authorized owner, before invoking the listByOwner controller method in shop.controller.js.
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, shopCtrl.listByOwner)

router.route('/api/shops/:shopId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.update)
  .delete(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.remove)

  /**The logo image file for the shop is uploaded by the user and stored in MongoDB as
data. Then, in order to be shown in the views, it is retrieved from the database as an
image file at a separate GET API. */
router.route('/api/shops/logo/:shopId')
//GET API which gets the image data from MongoDB and sends it as a file in the response
  .get(shopCtrl.photo, shopCtrl.defaultPhoto)

router.route('/api/shops/defaultphoto')
  .get(shopCtrl.defaultPhoto)

router.param('shopId', shopCtrl.shopByID)
/**To process the :userId param and retrieve the associated user from the database, we
will utilize the userByID method in the user controller to make the user is available in the request object
as profile: */
router.param('userId', userCtrl.userByID)

export default router
