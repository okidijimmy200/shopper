const cart = {
  /**The cart length is returned by the itemTotal helper method in cart-helper.js,
which reads the cart array stored in localStorage and returns the length of the
array */
    itemTotal() {
      if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
          return JSON.parse(localStorage.getItem('cart')).length
        }
      }
      return 0
    },
    /**The addToCart method invokes the addItem helper method defined in carthelper.
js. This addItem method takes the product item and a state-updating
callback function as parameters and stores the updated cart details in
localStorage and executes the callback that was passed */
    addItem(item, cb) {
      let cart = []
      if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
          cart = JSON.parse(localStorage.getItem('cart'))
        }
/**The cart data stored in localStorage contains an array of cart item objects, each
containing product details, the quantity of the product that was added to the cart
(which is set to 1 by default), and the ID of the shop the product belongs to. As
products get added to the cart and stored in localStorage, we will also display the
updated item count on the navigation menu, */
        cart.push({
          product: item,
          quantity: 1,
          shop: item.shop._id
        })
        localStorage.setItem('cart', JSON.stringify(cart))
        cb()
      }
    },
    /**The updateCart helper method takes the index of the product being updated in the
cart array and the new quantity value as parameters and updates the details stored in
localStorage. */
    updateCart(itemIndex, quantity) {
      let cart = []
      if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
          cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart[itemIndex].quantity = quantity
        localStorage.setItem('cart', JSON.stringify(cart))
      }
    },
    /**Retrieving cart details
Before the cart item details can be displayed, we need to retrieve the cart details
stored in localStorage. */
    getCart() {
      if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
          return JSON.parse(localStorage.getItem('cart'))
        }
      }
      return []
    },
    removeItem(itemIndex) {
      /**The removeItem helper method in cart-helper.js takes the index of the product
to be removed from the array, splices it out, and updates localStorage before
returning the updated cart array. */
      let cart = []
      if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
          cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart.splice(itemIndex, 1)
        localStorage.setItem('cart', JSON.stringify(cart))
      }
      return cart
    },
    /**If the request to the create order API is successful, we will empty the cart in
localStorage so that the user can add new items to the cart and place a new order if
desired. */
    emptyCart(cb) {
/**The emptyCart method removes the cart object from localStorage and updates the
state of the view by executing the callback passed to it from the placeOrder method,
where it is invoked */
      if (typeof window !== "undefined") {
        localStorage.removeItem('cart')
        cb()
      }
    }
  }
  
  export default cart
  