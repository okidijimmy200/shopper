import mongoose from 'mongoose'
/**The CartItem schema will represent each product that was ordered when an order
was placed. It will contain a reference to the product, the quantity of the product that
was ordered by the user, a reference to the shop the product belongs to, and its status, */
const CartItemSchema = new mongoose.Schema({
  product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
  quantity: Number,
  shop: {type: mongoose.Schema.ObjectId, ref: 'Shop'},
  status: {type: String,
    /**The status of the product can only have the values defined in the enums, with the
default value set to "Not Processed". This represents the current state of the product
order, as updated by the seller */
    default: 'Not processed',
    enum: ['Not processed' , 'Processing', 'Shipped', 'Delivered', 'Cancelled']}
})

/**The Order schema defined in will contain fields for storing the customer's name and email, along with their user account reference,
delivery address information, payment reference, created and updated-at
timestamps, and an array of products ordered */
const CartItem = mongoose.model('CartItem', CartItemSchema)
const OrderSchema = new mongoose.Schema({
  /**Products ordered: The main content of the order will be the list of products
ordered, along with details such as the quantity of each. We will record this
list in a field called products in the Order schema. The structure of each
product will be defined separately in CartItemSchema */
  products: [CartItemSchema],
  /**Customer name and email: To record the details of the customer who the
order is meant for, */
  customer_name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  /**User who placed the order: To reference the signed-in user who placed the
order, we will add an ordered_by field */
  customer_email: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },
  /**Delivery address: The delivery address information for the order will be
stored in the delivery address subdocument with the street, city, state,
zipcode, and country fields */
  delivery_address: {
    street: {type: String, required: 'Street is required'},
    city: {type: String, required: 'City is required'},
    state: {type: String},
    zipcode: {type: String, required: 'Zip Code is required'},
    country: {type: String, required: 'Country is required'}
  },
  /**Payment reference: The payment information will be relevant when the
order is updated and a charge needs to be created after an ordered product
has been processed by the seller. We will record the Stripe Customer ID
that's relevant to the credit card details in a payment_id field as a reference
to the payment information for this order */
  payment_id: {},
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  user: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

const Order = mongoose.model('Order', OrderSchema)

export {Order, CartItem}
