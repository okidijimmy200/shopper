/**The create fetch method that we invoked in the placeOrder here to make a POST request to the create
order API in the backend is defined in client/order/api-order.js. It takes the
checkout details, the card token, and user credentials as parameters and sends them
to the API */
const create = async (params, credentials, order, token) => {
    try {
      let response = await fetch('/api/orders/'+params.userId, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
          },
          body: JSON.stringify({order: order, token:token})
        })
        return response.json()
      }catch(err) {
        console.log(err)
      }
  }
/**This fetch method will
be used in the ShopOrders component to show the orders for each shop */
  const listByShop = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/orders/shop/'+params.shopId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    }catch(err){
      console.log(err)
    }
  }
 /**The cancelProduct, processCharge, and update fetch methods are defined in
api-order.js so that they can call the corresponding APIs in the backend to update
a canceled product's stock quantity, to create a charge on the customer's credit card
when the order for a product is processing, and to update the order with the product
status change, respectively */
////////////////////////////////////////////////////
/**To access this API from the frontend, we will add an update fetch method in apiorder.
js to make a call to this update API with the required parameters passed
from the view */
  const update = async (params, credentials, product) => {
    /**This update fetch method is called in the ProductOrderEdit view when the seller
selects any value other than Processing or Cancelled from the options in the
dropdown for an ordered product */
    try {
      let response = await fetch('/api/order/status/' + params.shopId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(product)
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }
  
  const cancelProduct = async (params, credentials, product) => {
    try {
      let response = await fetch('/api/order/'+params.shopId+'/cancel/'+params.productId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(product)
      })
      return response.json()
    }catch(err){
      console.log(err)
    }
  }
  
  const processCharge = async (params, credentials, product) => {
    try {
      let response = await fetch('/api/order/'+params.orderId+'/charge/'+params.userId+'/'+params.shopId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(product)
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  /**We will also need to set up a corresponding fetch method in api-order.js, which
is used in the view, in the ProductOrderEdit component, to make a request to this
API, retrieve the status values, and render these as options in the dropdown */
  const getStatusValues = async (signal) => {
    try {
      let response = await fetch('/api/order/status_values', {
        method: 'GET',
        signal: signal
      })
      return response.json()
    }catch(err) { 
      console.log(err)
    }
  }
  
  const listByUser = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/orders/user/'+params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }
  
  const read = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/order/' + params.orderId, {
        method: 'GET',
        signal: signal
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  export {
    create,
    listByShop,
    update,
    cancelProduct,
    processCharge,
    getStatusValues,
    listByUser,
    read
  }
  
