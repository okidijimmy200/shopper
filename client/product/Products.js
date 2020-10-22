//temp code
import React from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import {Link} from 'react-router-dom'
import AddToCart from './../cart/AddToCart'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
    textAlign: 'left',
    padding: '0 8px'
  },
  container: {
    minWidth: '100%',
    paddingBottom: '14px'
  },
  gridList: {
    width: '100%',
    minHeight: 200,
    padding: '16px 0 10px'
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    width: '100%'
  },
  tile: {
    textAlign: 'center'
  },
  image: {
    height: '100%'
  },
  tileBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    textAlign: 'left'
  },
  tileTitle: {
    fontSize:'1.1em',
    marginBottom:'5px',
    color:'rgb(189, 222, 219)',
    display:'block'
  }
}))

/**the list of products in a shop will be displayed to the user in an individual
view. So this component is added to the Shop Products Shop
component and given the list of relevant products as props, */
export default function Products(props){
  // Products component can be used to render different lists of products for buyers, including products in a shop, products by category, and products in search results.
  const classes = useStyles()
    return (
      <div className={classes.root}>
           {/* In the Products component, if the product list sent in the props contains products,
the list is iterated over and the relevant details of each product are rendered in a
Material-UI GridListTile, with a link to the individual product view and
an AddToCart component  */}
      {props.products.length > 0 ?
        (<div className={classes.container}>
          <GridList cellHeight={200} className={classes.gridList} cols={3}>
          {props.products.map((product, i) => (
            <GridListTile key={i} className={classes.tile}>
              <Link to={"/product/"+product._id}><img className={classes.image} src={'/api/product/image/'+product._id} alt={product.name} /></Link>
              <GridListTileBar className={classes.tileBar}
                title={<Link to={"/product/"+product._id} className={classes.tileTitle}>{product.name}</Link>}
                subtitle={<span>$ {product.price}</span>}
                actionIcon={
                  <AddToCart item={product}/>
                }
              />
            </GridListTile>
          ))}
          {/* If the array sent in the props is found to be empty, and this was a result of products
a search action by the user, we render an appropriate message to inform the user that no products were found. */}
        </GridList></div>) : props.searched && (<Typography variant="subheading" component="h4" className={classes.title}>No products found! :(</Typography>)}
      </div>)
}
Products.propTypes = {
  products: PropTypes.array.isRequired,
  searched: PropTypes.bool.isRequired
}
