//temp code
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import auth from './../auth/auth-helper'
import cart from './cart-helper.js'
import {CardElement, injectStripe} from 'react-stripe-elements'
import {create} from './../order/api-order.js'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  subheading: {
    color: 'rgba(88, 114, 128, 0.87)',
    marginTop: "20px",
  },
  checkout: {
    float: 'right',
    margin: '20px 30px'
  },
  error: {
    display: 'inline',
    padding: "0px 10px"
  },
  errorIcon: {
    verticalAlign: 'middle'
  },
  StripeElement: {
    display: 'block',
    margin: '24px 0 10px 10px',
    maxWidth: '408px',
    padding: '10px 14px',
    boxShadow: 'rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px',
    borderRadius: '4px',
    background: 'white'
  }
}))

const PlaceOrder = (props) => {
  const classes = useStyles()
  const [values, setValues] = useState({
    order: {},
    error: '',
    redirect: false,
    orderId: ''
  })
/**Clicking on the Place Order button will call the placeOrder method, which will
attempt to tokenize the card details using stripe.createToken. If this is
unsuccessful, the user will be informed of the error, but if this is successful, then the
checkout details and generated card token will be sent to our server's create order API */
  const placeOrder = ()=>{
    props.stripe.createToken().then(payload => {
      if(payload.error){
        setValues({...values, error: payload.error.message})
      }else{
        const jwt = auth.isAuthenticated()
        create({userId:jwt.user._id}, {
          t: jwt.token
        }, props.checkoutDetails, payload.token.id).then((data) => {
          if (data.error) {
            setValues({...values, error: data.error})
          } else {
            cart.emptyCart(()=> {
              setValues({...values, 'orderId':data._id,'redirect': true})
            })
          }
        })
      }
  })
}

/**view, which will show them the details of the order that was just placed. */

    if (values.redirect) {
      /**To
implement this redirect, we can use the Redirect component from React Router, */
      return (<Redirect to={'/order/' + values.orderId}/>)
    }
    return (
    <span>
      <Typography type="subheading" component="h3" className={classes.subheading}>
        Card details
      </Typography>
      {/* Stripe's CardElement is self-contained, so we can just add it to the PlaceOrder
component, then incorporate styles as desired, and the card detail input will be taken
care of */}
      <CardElement
        className={classes.StripeElement}
          {...{style: {
                        base: {
                          color: '#424770',
                          letterSpacing: '0.025em',
                          fontFamily: 'Source Code Pro, Menlo, monospace',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      }
          }}
      />
      <div className={classes.checkout}>
        { values.error &&
          (<Typography component="span" color="error" className={classes.error}>
            <Icon color="error" className={classes.errorIcon}>error</Icon>
              {values.error}
          </Typography>)
        }
        {/* placeorder btn */}
        <Button color="secondary" variant="contained" onClick={placeOrder}>Place Order</Button>
      </div>
    </span>)

}
/**In order to use Stripe's CardElement component from react-stripe-elements to
add the credit card field to the PlaceOrder component, we need to wrap the
PlaceOrder component using the injectStripe higher-order component (HOC)
from Stripe */
PlaceOrder.propTypes = {
  checkoutDetails: PropTypes.object.isRequired
}

/**The injectStripe HOC provides the props.stripe property that manages the
Elements group. This will allow us to call props.stripe.createToken within
PlaceOrder to submit card details to Stripe and get back the card token */
export default injectStripe(PlaceOrder)
