import Auction from '../models/auction.model'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import defaultImage from './../../client/assets/images/default.png'

/**The create method in the auction controller, which is invoked after a seller is
verified, uses the formidable node module to parse the multipart request that may
contain an image file uploaded by the user for the item image. If there is a
file, formidable will store it temporarily in the filesystem, and we will read it using
the fs module to retrieve the file type and data so that we can store it in
the image field in the auction document */
const create = (req, res) => {
  /**The item image file for the auction is uploaded by the user and stored in MongoDB as
data */
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Image could not be uploaded"
      })
    }
    let auction = new Auction(fields)
    auction.seller= req.profile
    if(files.image){
      auction.image.data = fs.readFileSync(files.image.path)
      auction.image.contentType = files.image.type
    }
    try {
      let result = await auction.save()
      res.status(200).json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

/**It retrieves the auction from the database and attaches it to the request object
so that it can be used in the next method. */
const auctionByID = async (req, res, next, id) => {
  try {
    let auction = await Auction.findById(id).populate('seller', '_id name').populate('bids.bidder', '_id name').exec()
    if (!auction)
      return res.status('400').json({
        error: "Auction not found"
      })
    req.auction = auction
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve auction"
    })
  }
}

/**in order for image to be shown in the views, it is retrieved from the database as an
image file at a separate GET API. The GET API is set up as an Express route
at /api/auctions/image/:auctionId, which gets the image data from MongoDB
and sends it as a file in the response */
const photo = (req, res, next) => {
  if(req.auction.image.data){
    res.set("Content-Type", req.auction.image.contentType)
    return res.send(req.auction.image.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+defaultImage)
}

/**The read controller
method, which returns this auction object in response to the client, */
const read = (req, res) => {
  /**We are removing the image field before sending the response, since images will be
retrieved as files in separate routes. */
  req.auction.image = undefined
  return res.json(req.auction)
}

const update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Photo could not be uploaded"
      })
    }
    let auction = req.auction
    auction = extend(auction, fields)
    auction.updated = Date.now()
    if(files.image){
      auction.image.data = fs.readFileSync(files.image.path)
      auction.image.contentType = files.image.type
    }
    try {
      let result = await auction.save()
      res.json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

/**The remove function retrieves the auction and uses the remove()
query to delete the user from the database */ 
const remove = async (req, res) => {
  try {
    let auction = req.auction
    let deletedAuction = auction.remove()
    res.json(deletedAuction)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }  
}

/**A GET request that's received at the /api/auctions route will invoke the listOpen
controller method, which will query the Auction collection in the database so that it
returns all the auctions with ending dates greater than the current date */
const listOpen = async (req, res) => {
  try {
    /**The auctions that are returned by the query in this listOpen method will be sorted
by the starting date, with auctions that start earlier shown first. These auctions will
also contain the ID and name details of the seller and each bidder. The resulting array
of auctions will be sent back in the response to the requesting clien */
    let auctions = await Auction.find({ 'bidEnd': { $gt: new Date() }}).sort('bidStart').populate('seller', '_id name').populate('bids.bidder', '_id name')
    res.json(auctions)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**A GET request, when received at the /api/auctions/by/:userId route, will
invoke the listBySeller controller method, which will query the Auction collection
in the database so that it returns all the auctions with sellers matching the user
specified by the userId parameter in the route */
const listBySeller = async (req, res) => {
  try {
    /**This method will return the auctions for the specified seller in response to the
requesting client, and each auction will also contain the ID and name details of the
seller and each bidder. */
    let auctions = await Auction.find({seller: req.profile._id}).populate('seller', '_id name').populate('bids.bidder', '_id name')
    res.json(auctions)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**A GET request, when received at the /api/auctions/bid/:userId route, will
invoke the listByBidder controller method, which will query the Auction collection
in the database so that it returns all the auctions that contain bids with a bidder
matching the user specified by the userId parameter in the route */
const listByBidder = async (req, res) => {
  try {
    /**This method will return the resulting auctions in response to the requesting client,
and each auction will also contain the ID and name details of the seller and each
bidder. */
    let auctions = await Auction.find({'bids.bidder': req.profile._id}).populate('seller', '_id name').populate('bids.bidder', '_id name')
    res.json(auctions)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**The auction object that's retrieved from the database will also contain the name and ID details of the seller and bidders, as we specified in the populate() methods. For
these API endpoints, the auction object is used next to verify that the currently signed-in user is the seller who created this given auction by invoking the isSeller
method */
const isSeller = (req, res, next) => {
  const isSeller = req.auction && req.auth && req.auction.seller._id == req.auth._id
  if(!isSeller){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  /**Once the seller has been verified, the next method is invoked to either update or
delete the auction, depending on whether a PUT or DELETE request was received */
  next()
}

export default {
  create,
  auctionByID,
  photo,
  defaultPhoto,
  listOpen,
  listBySeller,
  listByBidder,
  read,
  update,
  isSeller,
  remove
}
