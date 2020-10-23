import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Edit from '@material-ui/icons/Edit'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import {listByShop} from './../product/api-product.js'
import DeleteProduct from './../product/DeleteProduct'

const useStyles = makeStyles(theme => ({
  products: {
    padding: '24px'
  },
  addButton:{
    float:'right'
  },
  leftIcon: {
    marginRight: "8px"
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  cover: {
    width: 110,
    height: 100,
    margin: '8px'
  },
  details: {
    padding: '10px'
  },
}))

/**Implementing a separate MyProducts component this way gives the shop owner the
ability to see the list of products in their shop with the option to edit and delete each. */
export default function MyProducts (props){
  const classes = useStyles()
  const [products, setProducts] = useState([])
/**In MyProducts, the relevant products are first loaded in a state with an useEffect
hook using the listByShop fetch method */  
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listByShop({
      shopId: props.shopId
    }, signal).then((data)=>{
      if (data.error) {
        console.log(data.error)
      } else {
        setProducts(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
/**The removeProduct method, defined in MyProducts, is provided as the onRemove
prop to the DeleteProduct component */
  const removeProduct = (product) => {
    const updatedProducts = [...products]
    const index = updatedProducts.indexOf(product)
    updatedProducts.splice(index, 1)
    setProducts(updatedProducts)
  }

    return (
      <Card className={classes.products}>
        <Typography type="title" className={classes.title}>
          Products
          <span className={classes.addButton}>
            <Link to={"/seller/"+props.shopId+"/products/new"}>
              <Button color="primary" variant="contained">
                <Icon className={classes.leftIcon}>add_box</Icon>  New Product
              </Button>
            </Link>
          </span>
        </Typography>
        {/* This list of products is then iterated over with each product rendered in
the ListItem components along with edit and delete options, */}
        <List dense>
        {products.map((product, i) => {
            return <span key={i}>
              <ListItem>
                <CardMedia
                  className={classes.cover}
                  image={'/api/product/image/'+product._id+"?" + new Date().getTime()}
                  title={product.name}
                />
                <div className={classes.details}>
                  <Typography type="headline" component="h2" color="primary" className={classes.productTitle}>
                    {product.name}
                  </Typography>
                  <Typography type="subheading" component="h4" className={classes.subheading}>
                    Quantity: {product.quantity} | Price: ${product.price}
                  </Typography>
                </div>
                <ListItemSecondaryAction>
                  {/* The edit button links to the Edit Product view. */}
                  <Link to={"/seller/"+product.shop._id+"/"+product._id+"/edit"}>
                    <IconButton aria-label="Edit" color="primary">
                      <Edit/>
                    </IconButton>
                  </Link>
                  {/* The DeleteProduct
component handles the delete action, and reloads the list by calling an onRemove
method passed from MyProducts to update the state with the updated list of
products for the current shop. */}
                  <DeleteProduct
                    product={product}
                    shopId={props.shopId}
                    /**onRemove method passed from MyProducts to update the state with the updated list of
products for the current shop. */
  // The removeProduct method
// is passed as a prop to the DeleteProduct component when it is added to MyProducts
                    onRemove={removeProduct}/>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider/></span>})}
        </List>
      </Card>)
}
MyProducts.propTypes = {
  shopId: PropTypes.string.isRequired
}

