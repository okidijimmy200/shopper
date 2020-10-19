import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/auth-helper'
import {read, update} from './api-user.js'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  subheading: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  }
}))
/**the component will fetch the user's
information with their ID after verifying JWT for auth, and then load the form with
the received user information */
export default function EditProfile({ match }) {
  const classes = useStyles()
  const [values, setValues] = useState({
      name: '',
      email: '',
      password: '',
      seller: false,
      redirectToProfile: false,
      error: ''
  })
  const jwt = auth.isAuthenticated()
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, name: data.name, email: data.email, seller: data.seller})
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])

  const clickSubmit = () => {
       /**on form submission, we need to initialize FormData and append the values
from the fields that were updated */
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
/**When the form to edit profile details is submitted, the seller value is also added to
details sent in the update to the server */
      seller: values.seller || undefined
    }
    /**After appending all the fields and values to it, userData is sent with the fetch API
call to update the user */
    update({
      userId: match.params.userId
    }, {
      t: jwt.token
    }, user).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
/**On successful update, the user details stored in sessionStorage for auth purposes
should also be updated */
        auth.updateUser(data, ()=>{
          setValues({...values, userId: data._id, redirectToProfile: true})
        })
      }
    })
  }
  const handleChange = name => event => {
        /**update the input handleChange function so that we can store input
values for both the text fields and the file input */
    setValues({...values, [name]: event.target.value})
  }
  //Any changes to the switch will be set to the value of the seller in state by calling the handleCheck
  const handleCheck = (event, checked) => {
    setValues({...values, 'seller': checked})
  }
/**Depending on the response from the server, the user will either see an error message
or be redirected to the updated Profile page using the Redirect component */
  if (values.redirectToProfile) {
    return (<Redirect to={'/user/' + values.userId}/>)
  }
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Edit Profile
          </Typography>
          <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          <Typography variant="subtitle1" className={classes.subheading}>
            Seller Account
          </Typography>
{/* A signed-in user will see a toggle in the Edit Profile view, allowing them to either
activate or deactivate the seller feature. */}
          <FormControlLabel
            control={
              <Switch classes={{
                                checked: classes.checked,
                                bar: classes.bar,
                              }}
                      checked={values.seller}
                      onChange={handleCheck}
              />}
            label={values.seller? 'Active' : 'Inactive'}
          />
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
    )
}
