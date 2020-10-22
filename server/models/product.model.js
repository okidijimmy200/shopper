import mongoose from 'mongoose'
const ProductSchema = new mongoose.Schema({
  /**Product name and description: The name and description fields will be
String types, with name as a required field: */
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
/**Product image: The image field will store an image file to be uploaded by
the user as data in the MongoDB database: */
  image: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String,
    trim: true
  },
/**Product category: The category value will allow grouping products of the
same type together: */
  category: {
    type: String
  },
  /**Product quantity: The quantity field will represent the amount available
for selling in the shop */
  
  quantity: {
    type: Number,
    required: "Quantity is required"
  },
  /**Product price: The price field will hold the unit price this product will
cost the buyer: */
  price: {
    type: Number,
    required: "Price is required"
  },
  /**Created and updated at times: The created and updated fields will be
Date types, with created generated when a new product is added, and
the updated time changed when the product's details are modified: */
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  /**Product shop: The shop field will reference the shop to which the product
was added: */
  shop: {type: mongoose.Schema.ObjectId, ref: 'Shop'}
})

export default mongoose.model('Product', ProductSchema)
