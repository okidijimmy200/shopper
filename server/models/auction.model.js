//temp code
import mongoose from 'mongoose'
/**The Auction Schema in this model will have fields to store auction details
such as the name and description of the item being auctioned, along with an image
and a reference to the seller creating this auction. It will also have fields that specify
the start and end time for bidding on this auction, a starting value for bids, and the
list of bids that have been placed for this auction */
const AuctionSchema = new mongoose.Schema({
    /**Item name and description: The auction item name and description fields
will be string types, with itemName as a required field: */
  itemName: {
    type: String,
    trim: true,
    required: 'Item name is required'
  },
  description: {
    type: String,
    trim: true
  },
  /**Item image: The image field will store the image file representing the
auction item so that it can be uploaded by the user and stored as data in the
MongoDB database */
  image: {
    data: Buffer,
    contentType: String
  },
  /**Created and updated at times: The created and updated fields will
be Date types, with created generated when a new auction is added,
and updated changed when any auction details are modified */
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  /**Bidding start time: The bidStart field will be a Date type that will
specify when the auction goes live so that users can start placing bids */
  bidStart: {
    type: Date,
    default: Date.now
  },
  /**Bidding end time: The bidEnd field will be a Date type that will specify
when the auction ends, after which the users cannot place bids on this
auction: */
  bidEnd: {
    type: Date,
    required: "Auction end time is required"
  },
  /**Seller: The seller field will reference the user who is creating the auction: */
  seller: {
    type: mongoose.Schema.ObjectId, 
    ref: 'User'
  },
  /**Starting bid: The startingBid field will store values of the Number type,
and it will specify the starting price for this auction */
  startingBid: { type: Number, default: 0 },
  /**List of bids: The bids field will be an array containing details of each bid
placed against the auction. When we store bids in this array, we will push
the latest bid to the beginning of the array. Each bid will contain a reference
to the user placing the bid, the bid amount the user offered, and the
timestamp when the bid was placed */
  bids: [{
    bidder: {type: mongoose.Schema.ObjectId, ref: 'User'},
    bid: Number,
    time: Date
  }]
})

export default mongoose.model('Auction', AuctionSchema)
