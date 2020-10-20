import mongoose from 'mongoose'
/**he Shop schema in this model will have simple
fields to store shop details, along with a logo image, and a reference to the user who
owns the shop. */
const ShopSchema = new mongoose.Schema({
  /**Shop name and description: The name and description fields will be
string types, with name as a required field: */
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
/**Shop logo image: The image field will store the logo image file uploaded
by the user as data in the MongoDB database: */
  image: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String,
    trim: true
  },
/**Created at and updated at times: The created and updated fields will be
Date types, with created generated when a new shop is added, and
updated changed when any shop details are modified: */
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
/**Shop owner: The owner field will reference the user who creates the shop: */
  owner: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

export default mongoose.model('Shop', ShopSchema)
