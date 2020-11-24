//temp code
import React, {useState, useEffect}  from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import auth from '../auth/auth-helper'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'

/**we will integrate sockets using the Socket.IO client-side library, */
const io = require('socket.io-client')
const socket = io()

const useStyles = makeStyles(theme => ({
    bidHistory: {
        marginTop: '20px',
        backgroundColor: '#f3f3f3',
        padding: '16px'
    },
    placeForm: {
        margin: '0px 16px 16px',
        backgroundColor: '#e7ede4',
        display: 'inline-block'
    },
    marginInput: {
        margin: 16
    },
    marginBtn: {
        margin: '8px 16px 16px'
    }
}))
/**The Bidding component takes the auction object, the justEnded value, and an
updateBids function as props from the Auction component, and uses these in the
bidding process */
export default function Bidding (props) {
    const classes = useStyles()
    /**initialize the bid value in the state, add a change handling function for the
form input, and keep track of the minimum bid amount allowed */
    const [bid, setBid] = useState('')

    const jwt = auth.isAuthenticated()

    useEffect(() => {
        /**emit the auction room joining
and auction room leaving socket events when the component mounts and unmounts,
respectively. We pass the current auction's ID as the data.room value with these
emitted socket events */
        socket.emit('join auction room', {room: props.auction._id})
        return () => {
            socket.emit('leave auction room', {
              room: props.auction._id
            })
          }
    }, [])
/**Once the placed bid has been handled on the server, the updated auction containing the modified array of bids is sent to all the clients connected to the auction room. To
handle this new data on the client-side, we need to update the Bidding component to add a listener for this specific socket message */
    useEffect(() => {
        socket.on('new bid', payload => {
          props.updateBids(payload)
        })
        return () => {
            /**We will also remove the listener
with socket.off() in the useEffect cleanup when the component unloads */
            socket.off('new bid')
        }
    })
    const handleChange = event => {
        setBid(event.target.value)
    }
    /**we construct a bid object containing the new bid's details, including the
bid amount, bid time, and the bidder's user reference. */
    const placeBid = () => {
        let newBid = {
            bid: bid,
            time: new Date(),
            bidder: jwt.user
        }
        /** This new bid is emitted to the
server over the socket communication that's already been established for this auction
room, */
        socket.emit('new bid', {
            room: props.auction._id,
            bidInfo:  newBid
        })
        /**Once the message has been emitted over the socket, we will empty the input field
with setBid(''). */
        setBid('')
    }
    /**The minimum bid amount is determined by checking the latest bid placed. If any bids
were placed, the minimum bid needs to be higher than the latest bid; otherwise, it
needs to be higher than the starting bid that was set by the auction seller. */
    const minBid = props.auction.bids && props.auction.bids.length> 0 ? props.auction.bids[0].bid : props.auction.startingBid
    return(
        <div>
            {/* The form elements for placing a bid will only render if the current date is before the
auction end date. We also check if the justEnded value is false so that the form can
be hidden when the time ends in real-time as the timer counts down to 0. The form
elements will contain an input field, a hint at what minimum amount should be
entered, and a submit button, which will remain disabled unless a valid bid amount is
entered */}
            {!props.justEnded && new Date() < new Date(props.auction.bidEnd) && <div className={classes.placeForm}>
                <TextField id="bid" label="Your Bid ($)"  
                        value={bid} onChange={handleChange} 
                        type="number" margin="normal"
                        helperText={`Enter $${Number(minBid)+1} or more`}
                        className={classes.marginInput}/><br/>
                        {/* When the user clicks on the submit button, the placeBid function will be called */}
                <Button variant="contained" className={classes.marginBtn} color="secondary" disabled={bid < (minBid + 1)} onClick={placeBid} >Place Bid</Button><br/>
            </div>}
            <div className={classes.bidHistory}>
                <Typography variant="h6">All bids</Typography><br/>
                <Grid container spacing={4}>
                    <Grid item xs={3} sm={3}>
                        <Typography variant="subtitle1" color="primary">Bid Amount</Typography>
                    </Grid>
                    <Grid item xs={5} sm={5}>
                        <Typography variant="subtitle1" color="primary">Bid Time</Typography>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <Typography variant="subtitle1" color="primary">Bidder</Typography>
                    </Grid>
                </Grid>    
                {/* This bidding history view will basically iterate over the bids array for the auction
and display the bid amount, bid time, and bidder name for each bid object that's
found in the array. */}
                    {props.auction.bids.map((item, index) => {
                        return <Grid container spacing={4} key={index}>
                            <Grid item xs={3} sm={3}><Typography variant="body2">${item.bid}</Typography></Grid>
                            <Grid item xs={5} sm={5}><Typography variant="body2">{new Date(item.time).toLocaleString()}</Typography></Grid>
                            <Grid item xs={4} sm={4}><Typography variant="body2">{item.bidder.name}</Typography></Grid>
                        </Grid>
                    })}
                
            </div>
        </div>
    )
}