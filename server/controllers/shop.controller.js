import Shop from '../models/shop.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import defaultImage from './../../client/assets/images/default.png'

/**The create method in the shop controller, which is invoked after a seller is verified,
uses the formidable node module to parse the multipart request that may contain
an image file uploaded by the user for the shop logo */
//---------------------------------------------------------------------------------------

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Image could not be uploaded"
      })
    }
  /**If there is a file, formidable will store it temporarily in the filesystem, and we will read it using the module to
fs retrieve the filetype and data to store it in the field in the shop document. image */
    let shop = new Shop(fields)
    shop.owner= req.profile
  /**The logo image file for the shop is uploaded by the user and stored in MongoDB as data. Then, in order to be shown in the views, it is retrieved from the database as an
image file at a separate GET API. */
    if(files.image){
      shop.image.data = fs.readFileSync(files.image.path)
      shop.image.contentType = files.image.type
    }
    try {
      let result = await shop.save()
      res.status(200).json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

/**the userByID controller method retrieves the shop from the
database and attaches it to the request object to be used in the next method */
const shopByID = async (req, res, next, id) => {
  try {
  /**The shop object queried from the database will also contain the name and ID details
of the owner, as we specified in the populate() method. */
    let shop = await Shop.findById(id).populate('owner', '_id name').exec()
    if (!shop)
      return res.status('400').json({
        error: "Shop not found"
      })
    req.shop = shop
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve shop"
    })
  }
}

const photo = (req, res, next) => {
  if(req.shop.image.data){
    res.set("Content-Type", req.shop.image.contentType)
    return res.send(req.shop.image.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+defaultImage)
}

/**The read controller method then returns this shop object from the ShopByID in response to the client. */
const read = (req, res) => {
/**We are removing the image field before sending the response since images will be
retrieved as files in separate routes. */
  req.shop.image = undefined
  return res.json(req.shop)
}

/**The update controller method will use the formidable and fs modules to parse the form data and update the
existing shop in the database */
const update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Photo could not be uploaded"
      })
    }
    let shop = req.shop
    shop = extend(shop, fields)
    shop.updated = Date.now()
    if(files.image){
      shop.image.data = fs.readFileSync(files.image.path)
      shop.image.contentType = files.image.type
    }
    try {
      let result = await shop.save()
      res.json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

/**When a DELETE request is received at this route, if the isOwner method confirms
that the signed-in user is the owner of the shop, then the remove controller method
deletes the shop specified by the shopId in the param. */
const remove = async (req, res) => {
  try {
    let shop = req.shop
    let deletedShop = shop.remove()
    res.json(deletedShop)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }  
}

/**A GET request received at create route will invoke the list controller method, which
will query the shops collection in the database to return all the shops. */
const list = async (req, res) => {
  /**This method will return all the shops in the database in response to the requesting
client. */
  try {
    let shops = await Shop.find()
    res.json(shops)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
/**listByOwner method will query the Shop collection in the database to
get the matching shops */
const listByOwner = async (req, res) => {
  try {
  /**In the query to the Shop collection, we find all the shops where the owner field
matches the user-specified with the userId param, then populate the referenced
user's ID and name in the owner field, and return the resulting shops in an array in
the response to the client. */
    let shops = await Shop.find({owner: req.profile._id}).populate('owner', '_id name')
    res.json(shops)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**In this method, if the user is found to be authorized, the update controller is invoked
with a call to next(). */
const isOwner = (req, res, next) => {
  const isOwner = req.shop && req.auth && req.shop.owner._id == req.auth._id
  if(!isOwner){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

export default {
  create,
  shopByID,
  photo,
  defaultPhoto,
  list,
  listByOwner,
  read,
  update,
  isOwner,
  remove
}
