import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import queryString from 'query-string'
import {stripeUpdate} from './api-user.js'
import auth from './../auth/auth-helper'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px ${theme.spacing(2)}px`,
    color: theme.palette.protectedTitle,
    fontSize: '1.1em'
  },
  subheading: {
    color: theme.palette.openTitle,
    marginLeft: "24px"
  }
}))

/**When Stripe redirects the user to this URL, we will render the StripeConnect
component so that it handles Stripe's response to authentication */
export default function StripeConnect(props){
  const classes = useStyles()
  const [values, setValues] = useState({
    error: false,
    connecting: false,
    connected: false
  })
  const jwt = auth.isAuthenticated()
  /**When the StripeConnect component loads, we will use a useEffect hook to parse
the query parameters attached to the URL from the Stripe redirect */
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
/**For parsing, we use the same query-string node module that we used previously
to implement a product search. */
    const parsed = queryString.parse(props.location.search)
    if(parsed.error){
      setValues({...values, error: true})
    }
    /**if the URL query parameter contains an auth code and not an error, we make an API call in order to complete the Stripe OAuth
from our server with the stripeUpdate fetch method. */
    if(parsed.code){
      setValues({...values, connecting: true, error: false})
      //post call to stripe, get credentials and update user data
      /**The stripeUpdate fetch method is defined in api-user.js and passes the auth
code retrieved from Stripe to an API we will set up in our server */
      stripeUpdate({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, parsed.code, signal).then((data) => {
        if (data.error) {
          setValues({...values, error: true, connected: false, connecting: false})
        } else {
          setValues({...values, connected: true, connecting: false, error: false})
        }
      })
    }
    return function cleanup(){
      abortController.abort()
    }

  }, [])

    return (
      <div>
        <Paper className={classes.root} elevation={4}>
          <Typography type="title" className={classes.title}>
            Connect your Stripe Account
          </Typography>
          {values.error && (<Typography type="subheading" className={classes.subheading}>
              Could not connect your Stripe account. Try again later.
            </Typography>)}
          {values.connecting && (<Typography type="subheading" className={classes.subheading}>
              Connecting your Stripe account ...
            </Typography>)}
          {values.connected && (<Typography type="subheading" className={classes.subheading}>
              Your Stripe account successfully connected!
            </Typography>)}
        </Paper>
      </div>
    )
}
