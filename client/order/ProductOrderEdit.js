import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import auth from './../auth/auth-helper'
import {getStatusValues, update, cancelProduct, processCharge} from './api-order.js'

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
    paddingBottom: 0
  },
  listImg: {
    width: '70px',
    verticalAlign: 'top',
    marginRight: '10px'
  },
  listDetails: {
    display: "inline-block"
  },
  listQty: {
    margin: 0,
    fontSize: '0.9em',
    color: '#5f7c8b'
  },
  textField: {
    width: '160px',
    marginRight: '16px'
  },
  statusMessage: {
    position: 'absolute',
    zIndex: '12',
    right: '5px',
    padding: '5px'
  }
}))
/**ProductOrderEdit component, we will invoke this updateOrders method
when the seller interacts with the status update dropdown for any product that will
be rendered in the ProductOrderEdit component */
export default function ProductOrderEdit (props){
  const classes = useStyles()
  const [values, setValues] = useState({
      open: 0,
      statusValues: [],
      error: ''
  })
  /**To be able to list the valid status values in the dropdown option for updating an
ordered product's status, we will retrieve the list of possible status values from the
server in a useEffect hook in the ProductOrderEdit component */
  const jwt = auth.isAuthenticated()
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    /**The status values that are retrieved from the server are set to state and rendered in the
dropdown as a MenuItem */
    getStatusValues(signal).then((data) => {
      if (data.error) {
        setValues({...values, error: "Could not get status"})
      } else {
        setValues({...values, statusValues: data, error: ''})
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
/**When an option is selected from the possible status values
in the dropdown, the handleStatusChange method is called to update the orders in
the state, as well as to send a request to the appropriate backend API based on the
value that's selected. */
  const handleStatusChange = productIndex => event => {
    let order = props.order
    order.products[productIndex].status = event.target.value
    let product = order.products[productIndex]
/**depending on the value that's selected from the dropdown. Selecting to cancel or
process a product order will invoke separate APIs in the backend rather than the API
called when selecting any of the other status values */
    if (event.target.value == "Cancelled") {
      /**If the seller wishes to cancel the order for a product and selects Cancelled from the
status values dropdown for a specific product in the order, we will call the
cancelProduct fetch method inside the handleStatusChange method */
      cancelProduct({
        /**The cancelProduct fetch method will take the corresponding shop ID, product ID,
cartItem ID, selected status value, ordered quantity for the product, and user
credentials to send, along with the request to the cancel product API in the backend.
On a successful response from the backend, we will update the orders in the view */
          shopId: props.shopId,
          productId: product.product._id
        }, {
          t: jwt.token
        }, {
          cartItemId: product._id,
          status: event.target.value,
          quantity: product.quantity
        })
        /**This cancel product API will update the database for the order and the product
affected by this action */
        .then((data) => {
          if (data.error) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            props.updateOrders(props.orderIndex, order)
            setValues({
              ...values,
              error: ''
            })
          }
        })
    } else if (event.target.value == "Processing") {
      /**If a seller chooses to process the order for a product, we will need to invoke an API
that will charge the customer for the total cost of the product ordered. So, when a
seller selects Processing from the status values dropdown for a specific product in the
order, we will call the processCharge fetch method inside
the handleStatusChange method, */
      processCharge({
        /**The processCharge fetch method will take the corresponding order ID, shop ID,
customer's user ID, cartItem ID, selected status value, total cost for the ordered
product, and user credentials to send, along with the request to the process charge
API in the backend. On a successful response from the backend, we will update the
orders in the view accordingly. */
          userId: jwt.user._id,
          shopId: props.shopId,
          orderId: order._id
        }, {
          t: jwt.token
        }, {
          cartItemId: product._id,
          status: event.target.value,
          amount: (product.quantity * product.product.price)
        })
        .then((data) => {
          if (data.error) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            props.updateOrders(props.orderIndex, order)
            setValues({
              ...values,
              error: ''
            })
          }
        })
    } else {
      /**If a seller chooses to update the status of an ordered product so that it has a value
other than Cancelled or Processing, we will need to invoke an API that will update
the order in the database with this changed product status. So, when a seller selects
other status values from the dropdown for a specific product in the order, we will call
the update fetch method inside the handleStatusChange method, */
      update({
        /**The update fetch method will take the corresponding shop ID, cartItem ID, selected
status value, and user credentials to send, along with the request to the update order
API in the backend. On a successful response from the backend, we will update the
orders in the view */
          shopId: props.shopId
        }, {
          t: jwt.token
        }, {
          cartItemId: product._id,
          status: event.target.value
        })
        .then((data) => {
          if (data.error) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            props.updateOrders(props.orderIndex, order)
            setValues({
              ...values,
              error: ''
            })
          }
        })
    }
  }
    return (
    <div>
      <Typography component="span" color="error" className={classes.statusMessage}>
        {values.error}
      </Typography>
      <List disablePadding style={{backgroundColor:'#f8f8f8'}}>
        {/* This ProductOrderEdit component
will take an order object as a prop and iterate through the order's products array to
display only the products that have been purchased from the current shop, along
with a dropdown to change the status value of each product */}
        {props.order.products.map((item, index) => {
          return <span key={index}>
                  { item.shop == props.shopId &&
                    <ListItem button className={classes.nested}>
                      <ListItemText
                        primary={<div>
                                    <img className={classes.listImg} src={'/api/product/image/'+item.product._id}/>
                                    <div className={classes.listDetails}>
                                      {item.product.name}
                                      <p className={classes.listQty}>{"Quantity: "+item.quantity}</p>
                                    </div>
                                  </div>}/>
                      <TextField
                        id="select-status"
                        select
                        label="Update Status"
                        className={classes.textField}
                        value={item.status}
                        onChange={handleStatusChange(index)}
                        SelectProps={{
                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        margin="normal"
                      >
                        {values.statusValues.map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </ListItem>
                  }
                  <Divider style={{margin: 'auto', width: "80%"}}/>
                </span>})
              }
      </List>
    </div>)
}
ProductOrderEdit.propTypes = {
  shopId: PropTypes.string.isRequired,
  order: PropTypes.object.isRequired,
  orderIndex: PropTypes.number.isRequired,
  updateOrders: PropTypes.func.isRequired
}
