//temp code
import express from 'express'
import orderCtrl from '../controllers/order.controller'
import productCtrl from '../controllers/product.controller'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

router.route('/api/orders/:userId')
  .post(
    authCtrl.requireSignin, // It is ensured that the current user is signed in.
    userCtrl.stripeCustomer, //A Stripe Customer is either created or updated using the stripeCustomer user controller method,
    productCtrl.decreaseQuantity, // The stock quantities are updated for all the ordered products using the decreaseQuanity product controller method
    orderCtrl.create) // The order is created in the Order collection with the create order controller method

router.route('/api/orders/shop/:shopId')
  .get(authCtrl.requireSignin, shopCtrl.isOwner, orderCtrl.listByShop)

router.route('/api/orders/user/:userId')
  .get(authCtrl.requireSignin, orderCtrl.listByUser)

  /**The possible status values of an ordered product are set as enums in the CartItem
schema. */
router.route('/api/order/status_values')
  .get(orderCtrl.getStatusValues)

router.route('/api/order/:shopId/cancel/:productId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.increaseQuantity, orderCtrl.update)

router.route('/api/order/:orderId/charge/:userId/:shopId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, userCtrl.createCharge, orderCtrl.update)
/**When a product's status is changed to any value other than Processing or Cancelled,
a PUT request to '/api/order/status/:shopId' will directly update the order in
the database, given that the current user is the verified owner of the shop with the
ordered product. */
router.route('/api/order/status/:shopId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, orderCtrl.update)

router.route('/api/order/:orderId')
  .get(orderCtrl.read)

  /**To retrieve the user associated with the :userId parameter in the route, we will use
the userByID user controller method */
//////////////////////////////////////////
/**The userByID method gets the user from the User collection and attaches it to the request object so that it can be accessed by the next few methods ie product
controller method to decrease stock quantities and the order controller method to save a new order to the database */
router.param('userId', userCtrl.userByID)

/**To retrieve the shop associated with the :shopId parameter in the route, we will use
the shopByID shop controller method, which gets the shop from the Shop collection
and attaches it to the request object so that it can be accessed by the next methods */
router.param('shopId', shopCtrl.shopByID)
router.param('productId', productCtrl.productByID)
router.param('orderId', orderCtrl.orderByID)

export default router
