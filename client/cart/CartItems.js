import React, {useState} from 'react'
import auth from './../auth/auth-helper'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import cart from './cart-helper.js'
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  card: {
    margin: '24px 0px',
    padding: '16px 40px 60px 40px',
    backgroundColor: '#80808017'
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.openTitle,
    fontSize: '1.2em'
  },
  price: {
    color: theme.palette.text.secondary,
    display: 'inline'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: 0,
    width: 50
  },
  productTitle: {
    fontSize: '1.15em',
    marginBottom: '5px'
  },
  subheading: {
    color: 'rgba(88, 114, 128, 0.67)',
    padding: '8px 10px 0',
    cursor: 'pointer',
    display: 'inline-block'
  },
  cart: {
    width: '100%',
    display: 'inline-flex'
  },
  details: {
    display: 'inline-block',
    width: "100%",
    padding: "4px"
  },
  content: {
    flex: '1 0 auto',
    padding: '16px 8px 0px'
  },
  cover: {
    width: 160,
    height: 125,
    margin: '8px'
  },
  itemTotal: {
    float: 'right',
    marginRight: '40px',
    fontSize: '1.5em',
    color: 'rgb(72, 175, 148)'
  },
  checkout: {
    float: 'right',
    margin: '24px'
  },
  total: {
    fontSize: '1.2em',
    color: 'rgb(53, 97, 85)',
    marginRight: '16px',
    fontWeight: '600',
    verticalAlign: 'bottom'
  },
  continueBtn: {
    marginLeft: '10px'
  },
  itemShop: {
    display: 'block',
    fontSize: '0.90em',
    color: '#78948f'
  },
  removeButton: {
    fontSize: '0.8em'
  }
}))

export default function CartItems (props) {
  const classes = useStyles()
  // In the CartItems component, we will retrieve the cart items using the getCart helper method and set it to the state of the initial value of cartItems
  const [cartItems, setCartItems] = useState(cart.getCart())

  /**When the user updates this value, the handleChange method is called to enforce the
minimum value validation, update the cartItems in the state, and update the cart in
localStorage using a helper method. */
  const handleChange = index => event => {
    let updatedCartItems = cartItems
    if(event.target.value == 0){
      updatedCartItems[index].quantity = 1
    }else{
      updatedCartItems[index].quantity = event.target.value
    }
    setCartItems([...updatedCartItems])
    cart.updateCart(index, event.target.value)
  }

  /**The getTotal method will calculate the total price while taking the unit price and
quantity of each item in the cartItems array into consideration. */
  const getTotal = () => {
    return cartItems.reduce((a, b) => {
        return a + (b.quantity*b.product.price)
    }, 0)
  }
/**The removeItem click handler method uses the removeItem helper method to
remove the item from the cart in localStorage, then updates the cartItems in the
state. This method also checks whether the cart has been emptied so that checkout can
be hidden by using the setCheckout function passed as a prop from the Cart
component. */
  const removeItem = index => event =>{
    let updatedCartItems = cart.removeItem(index)
    if(updatedCartItems.length == 0){
      props.setCheckout(false)
    }
    setCartItems(updatedCartItems)
  }

  /**When the checkout button is clicked, the openCheckout method will use the
setCheckout method passed as a prop to set the checkout value to true in the Cart
component. */
  const openCheckout = () => {
    props.setCheckout(true)
  }

    return (<Card className={classes.card}>
      <Typography type="title" className={classes.title}>
        Shopping Cart
      </Typography>
      {/* If the cart contains items, the CartItems component iterates over the items and
renders the products in the cart. If no items have been added, the cart view just
displays a message stating that the cart is empty */}
      {cartItems.length>0 ? (<span>
          {cartItems.map((item, i) => {
            /**For each product item, we show the details of the product and an editable quantity
text field, along with a remove item option. Finally, we show the total price of the
items in the cart and the option to start the checkout operation. */
            return <span key={i}><Card className={classes.cart}>
              <CardMedia
              /**Then, this cartItems array that was retrieved from localStorage is iterated over
using the map function to render the details of each item, */
                className={classes.cover}
                image={'/api/product/image/'+item.product._id}
                title={item.product.name}
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Link to={'/product/'+item.product._id}><Typography type="title" component="h3" className={classes.productTitle} color="primary">{item.product.name}</Typography></Link>
                  <div>
                    <Typography type="subheading" component="h3" className={classes.price} color="primary">$ {item.product.price}</Typography>
                    <span className={classes.itemTotal}>${item.product.price * item.quantity}</span>
                    <span className={classes.itemShop}>Shop: {item.product.shop.name}</span>
                  </div>
                </CardContent>
                <div className={classes.subheading}>
  {/* Each cart item displayed in the cart view will contain an editable TextField that will
allow the user to update the quantity for each product they are buying, with a
minimum allowed value of 1, */}
                  Quantity: <TextField
                              value={item.quantity}
                              onChange={handleChange(i)}
                              type="number"
                              inputProps={{
                                  min:1
                              }}
                              className={classes.textField}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              margin="normal"/>
                              {/* Each item in the cart will have a remove option next to it. This remove item option is
a button that, when clicked, passes the array index of the item to the removeItem
method so that it can be removed from the array. */}
                            <Button className={classes.removeButton} color="primary" onClick={removeItem(i)}>x Remove</Button>
                </div>
              </div>
            </Card>
            <Divider/>
          </span>})
        }
        <div className={classes.checkout}>
          {/* At the bottom of the CartItems component, we will display the total price of the
items in the cart. */}
          <span className={classes.total}>Total: ${getTotal()}</span>
          {/* The user will see the option to perform the checkout depending on whether they are
signed in and whether the checkout has already been opened, */}
          {!props.checkout && (auth.isAuthenticated()?
            <Button color="secondary" variant="contained" onClick={openCheckout}>Checkout</Button>
            :
            <Link to="/signin">
              <Button color="primary" variant="contained">Sign in to checkout</Button>
            </Link>)}
          <Link to='/' className={classes.continueBtn}>
            <Button variant="contained">Continue Shopping</Button>
          </Link>
        </div>
      </span>) :
      <Typography variant="subtitle1" component="h3" color="primary">No items added to your cart.</Typography>
    }
    </Card>)
}

CartItems.propTypes = {
  checkout: PropTypes.bool.isRequired,
  setCheckout: PropTypes.func.isRequired
}
