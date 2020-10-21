//We will use this method in the create new shop form view,
const create = async (params, credentials, shop) => {
    try {
      let response = await fetch('/api/shops/by/'+ params.userId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: shop
      })
        return response.json()
      } catch(err) { 
        console.log(err)
      }
  }
  /**The list method on the client side will use fetch to make a GET request to the API, */
  const list = async (signal) => {
    try {
      let response = await fetch('/api/shops', {
        method: 'GET',
        signal: signal
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }
  
  /**to fetch the shops for a specific user using this list by owner API, we
will add a fetch method that takes the signed-in user's credentials to make a GET
request to the API route with the specific user ID passed in the URL. */
  const listByOwner = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/shops/by/'+params.userId, {
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
  
  const read = async (params, signal) => {
    try {
      let response = await fetch('/api/shop/' + params.shopId, {
        method: 'GET',
        signal: signal,
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }
  
  const update = async (params, credentials, shop) => {
    try {
      let response = await fetch('/api/shops/' + params.shopId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: shop
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  /**The fetch method will need to take the shop ID and current user's
auth credentials then call the delete shop API with these values */
  const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/shops/' + params.shopId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  export {
    create,
    list,
    listByOwner,
    read,
    update,
    remove
  }
  