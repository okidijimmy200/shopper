import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from '../../config/config'

const signin = async (req, res) => {
    // The POST request object receives the email and password in req.body
    try {
        // This email is used to retrieve a matching user from the database
        let user = await User.findOne({"email": req.body.email})
        if(!user)
            return res.status('401').json({error: "User not found"})
        /**the password authentication method defined in UserSchema is used to verify the password that's
received in req.body from the client. */
        if(!user.authenticate(req.body.password)) {
            return res.status('401').send({error: "Email and password don't match"})
        }

        /**If the password is successfully verified, the JWT module is used to generate a signed
JWT using a secret key and the user's _id value. */
        const token = jwt.sign({ _id: user._id}, config.jwtSecret)

        /**we can also set the token to a cookie in the response object so that
it is available to the client-side if cookies are the chosen form of JWT storage */
        res.cookie('t', token, {expire: new Date() + 9999})

        // the signed JWT is returned to the authenticated client, along with the user's details.
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
/**update the response sent back in the controller method to add this detail,
signin */
///////////////////////////////////////////////////////////////////////////////
/**Using this seller field value, we can render the frontend based on authorizations
permitted only to seller accounts */
                seller: user.seller
            }
        })
    }
    catch(err) {
        return res.status('401').json({error: "Could not sign in"})
    }

}

const signout = (req, res) => {
    // signout function clears the response cookie containing the signed JWT
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })

}

const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: ['HS256']
})

/**the hasAuthorization function defined in auth.controller.js
will check whether the authenticated user is the same as the user being updated or
deleted before the corresponding CRUD controller function is allowed to proceed. */
const hasAuthorization = (req, res, next) => {
    /**req.auth object is populated by express-jwt in requireSignin after
authentication verification, */
    const authorised = req.profile && req.auth
        && req.profile._id == req.auth._id
        /**req.profile is populated by the userByID
function in user.controller.js. */

    if (!authorised) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export default {signin, signout, requireSignin, hasAuthorization}