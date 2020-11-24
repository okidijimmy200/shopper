/**Socket.IO code that's needed on the server-side to implement real-time features */

import Auction from '../models/auction.model'

export default (server) => {
    /**bidding.controller function will
initialize socket.io and then listen on the connection event for incoming socket
messages from clients, as shown in the following code. */
    const io = require('socket.io').listen(server)
    io.on('connection', function(socket){
        socket.on('join auction room', data => {
            socket.join(data.room)
        })
        /**When a new client first connects and then disconnects to the socket connection, we
will subscribe and unsubscribe the client socket to a given channel. The channel will
be identified by the auction ID that will be passed in the data.room property from
the client. This way, we will have a different channel or room for each auction. */
        socket.on('leave auction room', data => {
            socket.leave(data.room)
        })
        socket.on('new bid', data => {
            bid(data.bidInfo, data.room)
        })
    })
    /**we will update the socket event handlers in the socket
connection listener code in order to add a handler for the new bid socket message */
    const bid = async (bid, auction) => {
/**In the preceding code, when the socket receives the emitted new bid message, we use
the attached data to update the specified auction with the new bid information in a
function called bid */
        try {
/**The bid function takes the new bid details and the auction ID as arguments and
performs a findOneAndUpdate operation on the Auction collection. To find the
auction to be updated, besides querying with the auction ID, we also ensure that the
new bid amount is larger than the last bid placed at position 0 of the bids array in
this auction document. If an auction is found that matches the provided ID and also
meets this condition of the last bid being smaller than the new bid, then this auction is
updated by pushing the new bid into the first position of the bids array */
          let result = await Auction.findOneAndUpdate({_id:auction, $or: [{'bids.0.bid':{$lt:bid.bid}},{bids:{$eq:[]}} ]}, {$push: {bids: {$each:[bid], $position: 0}}}, {new: true})
                                  .populate('bids.bidder', '_id name')
                                  .populate('seller', '_id name')
                                  .exec()
            io
            .to(auction)
            /**After the update to the auction in the database, we emit the new bid message over the
socket.io connection to all the clients currently connected to the corresponding
auction room */
            .emit('new bid', result)
        } catch(err) {
          console.log(err)
        }
    }
}

