//temp code
import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import ViewIcon from '@material-ui/icons/Visibility'
import Divider from '@material-ui/core/Divider'
import DeleteAuction from './DeleteAuction'
import auth from '../auth/auth-helper'
import {Link} from 'react-router-dom'

/**The calculateTimeLeft method takes the end date and compares it with the
current date to calculate the difference and makes a timeLeft object that records the
remaining days, hours, minutes, and seconds, as well as a timeEnd state. If the time
has ended, the timeEnd state is set to true */
const calculateTimeLeft = (date) => {
  const difference = date - new Date()
  let timeLeft = {}

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      timeEnd: false
    }
  } else {
      timeLeft = {timeEnd: true}
  }
  return timeLeft
}

export default function Auctions(props){
  const currentDate = new Date()
  /**To calculate and render the time left for auctions that have already started, we define
a showTimeLeft method, which takes the end date as an argument and uses
the calculateTimeLeft method to construct the time string rendered in the view. */
  const showTimeLeft = (date) => {
    let timeLeft = calculateTimeLeft(date)
    return !timeLeft.timeEnd && <span>
      {timeLeft.days != 0 && `${timeLeft.days} d `} 
      {timeLeft.hours != 0 && `${timeLeft.hours} h `} 
      {timeLeft.minutes != 0 && `${timeLeft.minutes} m `} 
      {timeLeft.seconds != 0 && `${timeLeft.seconds} s`} left
    </span>
  }
  const auctionState = (auction)=>{
    return (
      /**For each auction item, besides displaying some basic auction details, we give the
users an option to open each auction in a separate link. We also conditionally render
details such as when an auction will start, whether bidding has started or ended, how
much time is left, and what the latest bid is. */
      <span>
          {currentDate < new Date(auction.bidStart) && `Auction Starts at ${new Date(auction.bidStart).toLocaleString()}`}
          {currentDate > new Date(auction.bidStart) && currentDate < new Date(auction.bidEnd) && <>{`Auction is live | ${auction.bids.length} bids |`} {showTimeLeft(new Date(auction.bidEnd))}</>}
          {currentDate > new Date(auction.bidEnd) && `Auction Ended | ${auction.bids.length} bids `} 
          {currentDate > new Date(auction.bidStart) && auction.bids.length> 0 && ` | Last bid: $ ${auction.bids[0].bid}`}
      </span>
    )
  }
    return (
        <List dense>
          {/* The Auctions component will iterate over the array of auctions received as a
prop and display each auction in a Material-UI ListItem component */}
        {props.auctions.map((auction, i) => {
            return   <span key={i}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar variant='square' src={'/api/auctions/image/'+auction._id+"?" + new Date().getTime()}/>
                </ListItemAvatar>
                <ListItemText primary={auction.itemName} secondary={auctionState(auction)}/>
                <ListItemSecondaryAction>
                    <Link to={"/auction/" + auction._id}>
                      <IconButton aria-label="View" color="primary">
                        <ViewIcon/>
                      </IconButton>
                    </Link>
                    {/* We will update the code for the auctions list view to conditionally show the edit and
delete options to the seller. In the Auctions component, which is where a list of
auctions is iterated over to render each item in ListItem, we will add two more
options in the ListItemSecondaryAction component */}
                { auth.isAuthenticated().user && auth.isAuthenticated().user._id == auction.seller._id &&
                  <>
                  {/* The link to the edit view and the delete component are rendered conditionally if the
currently signed in user's ID matches the ID of the auction seller */}
                    <Link to={"/auction/edit/" + auction._id}>
                      <IconButton aria-label="Edit" color="primary">
                        <Edit/>
                      </IconButton>
                    </Link>
                    <DeleteAuction auction={auction} onRemove={props.removeAuction}/>
                  </>
                }
                </ListItemSecondaryAction>
              </ListItem>
              <Divider/>
            </span>})}
        </List>
    )
}

Auctions.propTypes = {
    auctions: PropTypes.array.isRequired,
    removeAuction: PropTypes.func.isRequired
  }

