import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import {list} from './api-shop.js'
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3)
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.protectedTitle,
    textAlign: 'center',
    fontSize: '1.2em'
  },
  avatar:{
    width: 100,
    height: 100
  },
  subheading: {
    color: theme.palette.text.secondary
  },
  shopTitle: {
    fontSize: '1.2em',
    marginBottom: '5px'
  },
  details: {
    padding: '24px'
  }
}))
/**In the Shops component, we will render the list of shops in a Material-UI List, after
fetching the data from the server and setting the data in a state to be displayed */
export default function Shops(){
  const classes = useStyles()
  const [shops, setShops] = useState([])

/**To implement this component, we first need to fetch and render the list of shops. We
will make the fetch API call in the useEffect hook, and set the received shops array
in the state */
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    list(signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setShops(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [])

    return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          All Shops
        </Typography>
        <List dense>
    {/* In the Shops component view, this retrieved shops array is iterated over using map,
with each shop's data rendered in the view in a Material-UI ListItem, and each
ListItem is also linked to the individual shop's view, */}
          {shops.map((shop, i) => {
            return <Link to={"/shops/"+shop._id} key={i}>
              <Divider/>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}  src={'/api/shops/logo/'+shop._id+"?" + new Date().getTime()}/>
                </ListItemAvatar>
                <div className={classes.details}>
                  <Typography type="headline" component="h2" color="primary" className={classes.shopTitle}>
                    {shop.name}
                  </Typography>
                  <Typography type="subheading" component="h4" className={classes.subheading}>
                    {shop.description}
                  </Typography>
                </div>
              </ListItem>
              <Divider/>
            </Link>})}
        </List>
      </Paper>
    </div>)
}
