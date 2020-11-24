//temp code
import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import {read} from './api-auction.js'
import {Link} from 'react-router-dom'
import auth from '../auth/auth-helper'
import Timer from './Timer'
import Bidding from './Bidding'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 60,
  },
  flex:{
    display:'flex'
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '16px',
    color: theme.palette.openTitle
  },
  description: {
    margin: '16px',
    fontSize: '0.9em',
    color: '#4f4f4f'
  },
  price: {
    padding: '16px',
    margin: '16px 0px',
    display: 'flex',
    backgroundColor: '#93c5ae3d',
    fontSize: '1.3em',
    color: '#375a53',
  },
  media: {
    height: 300,
    display: 'inline-block',
    width: '100%',
  },
  icon: {
    verticalAlign: 'sub'
  },
  link:{
    color: '#3e4c54b3',
    fontSize: '0.9em'
  },
  itemInfo:{
      width: '35%',
      margin: '16px'
  },
  bidSection: {
      margin: '20px',
      minWidth: '50%'
  },
  lastBid: {
    color: '#303030',
    margin: '16px',
  }
}))

export default function Auction ({match}) {
  const classes = useStyles()
  const [auction, setAuction] = useState({})
  const [error, setError] = useState('')
  //jst ended variable
  const [justEnded, setJustEnded] = useState(false)

    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  /**The implementation of the Auction component will retrieve the auction details by
calling the read auction API in a useEffect hook */
      read({auctionId: match.params.auctionId}, signal).then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setAuction(data)
        }
      })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.auctionId])
  /**The update function that's provided to the Timer component will help set the value
of the justEnded variable from false to true. This justEnded value is passed to
the Bidding component so that it can be used to disable the option to place bids
when the time ends */
  const updateBids = (updatedAuction) => {
    setAuction(updatedAuction)
  }
  const update = () => {
    setJustEnded(true)
  }
  const imageUrl = auction._id
          ? `/api/auctions/image/${auction._id}?${new Date().getTime()}`
          : '/api/auctions/defaultphoto'
  const currentDate = new Date()
    return (
        <div className={classes.root}>
              <Card className={classes.card}>
                <CardHeader
                  title={auction.itemName}
                  subheader={<span>
                    {/* In the component view, we will render the auction state by considering the current
date and the given auction's bidding start and end timings */}
{/* if the current date is before the bidStart date, we show a
message indicating that the auction has not started yet */}
                    {currentDate < new Date(auction.bidStart) && 'Auction Not Started'}
                    {/* If the current date is between the bidStart and bidEnd dates, then the auction is live. */}
                    {currentDate > new Date(auction.bidStart) && currentDate < new Date(auction.bidEnd) && 'Auction Live'}
                    {/* If the current date is after
the bidEnd date, then the auction has ended. */}
                    {currentDate > new Date(auction.bidEnd) && 'Auction Ended'}
                    </span>}
                />
                <Grid container spacing={6}>
                  <Grid item xs={5} sm={5}>
                    <CardMedia
                        className={classes.media}
                        image={imageUrl}
                        title={auction.itemName}
                    />
                    <Typography component="p" variant="subtitle1" className={classes.subheading}>
                    About Item</Typography>
                    <Typography component="p" className={classes.description}>
                    {auction.description}</Typography>
                  </Grid>
                  
                  <Grid item xs={7} sm={7}>
                    {/* The Auction component will also conditionally render a timer and a bidding section,
depending on whether the current user is signed in, and also on the state of the
auction at the moment */}
{/* ----------------------------------------- */}
{/* If the current date happens to be after the bid starting time, instead of showing the
start time, we render the Timer component to show the time remaining until bidding
ends */}
                    {currentDate > new Date(auction.bidStart) 
                    ? (<>
                    {/* The Auction component provides it with props containing
the auction end time value, as well as a function to update the auction view when the
time ends, */}
                        <Timer endTime={auction.bidEnd} update={update}/> 
                        { auction.bids.length > 0 &&  
                        // we show the last bid amount, which will be the first item in the auction bids array if some bids were already placed.
                            <Typography component="p" variant="subtitle1" className={classes.lastBid}>
                                {` Last bid: $ ${auction.bids[0].bid}`}
                            </Typography>
                        }
                        {/* If the current user is signed in when the
auction is in this state, we also render a Bidding component, which will allow them
to bid and see the bidding history. */}
                        { !auth.isAuthenticated() && <Typography>Please, <Link to='/signin'>sign in</Link> to place your bid.</Typography> }
                        { auth.isAuthenticated() && <Bidding auction={auction} justEnded={justEnded} updateBids={updateBids}/> }
                      </>)
                    : <Typography component="p" variant="h6">{`Auction Starts at ${new Date(auction.bidStart).toLocaleString()}`}</Typography>}
                  </Grid>
           
                </Grid>
                
              </Card>

        </div>)
}
