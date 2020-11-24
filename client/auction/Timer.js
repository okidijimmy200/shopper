//temp code
import React, {useState, useEffect}  from 'react'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    endTime: {
      fontSize: '0.75em',
      color: '#323232',
      fontWeight: 300
    },
    subheading: {
      margin: '16px',
      color: theme.palette.openTitle
    },
  }))

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
// These props will be used in the Timer component to calculate time left and to update the view when time is up
export default function Timer (props) {
  const classes = useStyles()
  // we will initialize the timeLeft variable in the state, using the end time value sent in the props from the Auction component
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(new Date(props.endTime)))
/**This useEffect hook will run after every render
caused by the state update with setTimeLeft. */
    useEffect(() => {
      let timer = null
      if(!timeLeft.timeEnd){
        /**To calculate the time left until the auction ends, we utilize the calculateTimeLeft
metho */
        timer = setTimeout(() => {
          /**If the time has not ended already, we will use setTimeout to update the timeLeft
value after 1 second has passed */
            setTimeLeft(calculateTimeLeft(new Date(props.endTime)))
        }, 1000)
      }else{
        /**
--As a result, the timeLeft value will keep updating every second until the timeEnd
value is true. When the timeEnd value does become true as the time is up, we will
execute the update function that's sent in the props from the Auctions component */
          props.update()
      }
      return () => {
        /**To avoid a memory leak and to clean up in the useEffect hook, we will use
clearTimeout to stop any pending setTimeout calls. */
        clearTimeout(timer)
      }
    })
    return (<div className={classes.subheading}>
      {/* To show this updating
timeLeft value, we just need to render it in the view, */}
        {!timeLeft.timeEnd? <Typography component="p" variant="h6" >
          {/* If there is time left, we render the days, hours, minutes, and seconds remaining until
the auction ends using the timeLeft object. We also indicate the exact date and time
when the auction ends. If the time is up, we just indicate that the auction ended. */}
                {timeLeft.days != 0 && `${timeLeft.days} d `} 
                {timeLeft.hours != 0 && `${timeLeft.hours} h `} 
                {timeLeft.minutes != 0 && `${timeLeft.minutes} m `} 
                {timeLeft.seconds != 0 && `${timeLeft.seconds} s`} left <span className={classes.endTime}>{`(ends at ${new Date(props.endTime).toLocaleString()})`}</span></Typography> : 
            <Typography component="p" variant="h6" >Auction ended</Typography>}
        </div>
    )
}