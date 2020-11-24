import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import auctionCtrl from '../controllers/auction.controller'

const router = express.Router()

router.route('/api/auctions')
  .get(auctionCtrl.listOpen)

router.route('/api/auctions/bid/:userId')
  .get(auctionCtrl.listByBidder)

router.route('/api/auction/:auctionId')
  .get(auctionCtrl.read)

router.route('/api/auctions/by/:userId')
/**A POST request to this route  will ensure the requesting user is signed in and is also authorized */
  .post(authCtrl.requireSignin,
     authCtrl.hasAuthorization,
      userCtrl.isSeller, /**before creating the auction, it is checked if this given user is a seller using the isSeller method that's defined in the user controller methods. */
      auctionCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, auctionCtrl.listBySeller)

router.route('/api/auctions/:auctionId')
  .put(authCtrl.requireSignin, auctionCtrl.isSeller, auctionCtrl.update)
  .delete(authCtrl.requireSignin, auctionCtrl.isSeller, auctionCtrl.remove)

  /**in order for imaage to be shown in the views, it is retrieved from the database as an
image file at a separate GET API. The GET API is set up as an Express route
at /api/auctions/image/:auctionId, which gets the image data from MongoDB
and sends it as a file in the response */
router.route('/api/auctions/image/:auctionId')
  .get(auctionCtrl.photo, auctionCtrl.defaultPhoto)

router.route('/api/auctions/defaultphoto')
  .get(auctionCtrl.defaultPhoto)

router.param('auctionId', auctionCtrl.auctionByID)
/**To process the :userId parameter and retrieve the associated user from the database,
we will utilize the userByID method from the user controller methods so that the user is available in the request object as profile. */
router.param('userId', userCtrl.userByID)

export default router
