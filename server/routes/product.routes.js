import express from 'express'
import productCtrl from '../controllers/product.controller'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'

const router = express.Router()

router.route('/api/products/by/:shopId')
// POST request that will let authorized shop owners save new products to the database
/**Sending a request to this route will create a new product associated
with the shop identified by the :shopId param. */
//-------------------------------------------------------------------------------------
/**The code to handle a request to the create product API route will first check that the current user is the owner of the shop to which the new product will be added before
creating the new product in the database. This API utilizes the shopByID and isOwner methods from the shop controller to process
the :shopId param and to verify that the current user is the shop owner, before invoking the create controller method. */
  .post(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.create)
  .get(productCtrl.listByShop)

router.route('/api/products/latest')
  .get(productCtrl.listLatest)

router.route('/api/products/related/:productId')
  .get(productCtrl.listRelated)

router.route('/api/products/categories')
  .get(productCtrl.listCategories)

router.route('/api/products')
  .get(productCtrl.list)

router.route('/api/products/:productId')
  .get(productCtrl.read)

router.route('/api/product/image/:productId')
  .get(productCtrl.photo, productCtrl.defaultPhoto)
router.route('/api/product/defaultphoto')
  .get(productCtrl.defaultPhoto)

router.route('/api/product/:shopId/:productId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.update)
  .delete(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.remove)

  /**Sending a post request to thisproducts/by/:shopId route will create a new product associated
with the shop identified by the :shopId param. */
router.param('shopId', shopCtrl.shopByID)
router.param('productId', productCtrl.productByID)

export default router
