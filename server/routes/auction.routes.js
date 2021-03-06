import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import auctionCtrl from '../controllers/auction.controller'

const router = express.Router()

router.route('/api/auctions')
/**To retrieve the list of open auctions from the database, we will define a backend API
that accepts a GET request and queries the Auction collection to return the open
auctions that are found in the response. */
  .get(auctionCtrl.listOpen)

  /**To be able to display all the auctions that a given user placed bids in, we will define a
backend API that accepts a GET request and queries the Auction collection so that it
returns the relevant auctions in the response. */
router.route('/api/auctions/bid/:userId')
  .get(auctionCtrl.listByBidder)

  /**we will implement a read auction API in the backend that will accept a GET request with a specified auction ID and return the
corresponding auction document from the Auction collection in the database. */
router.route('/api/auction/:auctionId')
  .get(auctionCtrl.read)

  /**To retrieve these
auctions from the database, we will define a backend API that accepts a GET request
and queries the Auction collection so that it returns the auctions by a specific seller */
router.route('/api/auctions/by/:userId')
/**A POST request to this route  will ensure the requesting user is signed in and is also authorized */
  .post(authCtrl.requireSignin,
     authCtrl.hasAuthorization,
      userCtrl.isSeller, /**before creating the auction, it is checked if this given user is a seller using the isSeller method that's defined in the user controller methods. */
      auctionCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, auctionCtrl.listBySeller)

  /**The :auctionId param in the /api/auctions/:auctionId route URL will invoke
the auctionByID controller method */
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

  
  /**The :auctionId param in the route URL invokes the auctionByID controller
method when a GET request is received at this route */
router.param('auctionId', auctionCtrl.auctionByID)
/**To process the :userId parameter and retrieve the associated user from the database,
we will utilize the userByID method from the user controller methods so that the user is available in the request object as profile. */
router.param('userId', userCtrl.userByID)

export default router
