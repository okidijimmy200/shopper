/**In order to construct the query parameters in the correct format, we will use the
query-string node module, which will help stringify the params object into a query
string that can be attached to the request route URL. The keys and values in this
params object will be defined by the React component where we call this list
method. */
import queryString from 'query-string'

/**to make a POST request to the create API by passing the multipart form data from the view. This fetch method can then
be utilized in the React component, which takes the product details from the user and
sends the request to create a new product. */
const create = async (params, credentials, product) => {
  try {
    let response = await fetch('/api/products/by/'+ params.shopId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: product
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
}

/**To use this read product API in the frontend, we will need to add a fetch method
which is then  used in the React component, which will render the
individual product details, */
const read = async (params, signal) => {
  try {
    let response = await fetch('/api/products/' + params.productId, {
      method: 'GET',
      signal: signal
    })
    return response.json()
  } catch(err) {
    console.log(err)
  }
}

const update = async (params, credentials, product) => {
  try {
    let response = await fetch('/api/product/' + params.shopId +'/'+params.productId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: product
    })
    return response.json()
  } catch(err) {
    console.log(err)
  }
}

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/product/' + params.shopId +'/'+params.productId, {
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

/**In the frontend, to fetch the products in a specific shop using this API to list by shop,
we will also need to add a fetch method */
const listByShop = async (params, signal) => {
  try {
    let response = await fetch('/api/products/by/'+params.shopId, {
      method: 'GET',
      signal: signal
    })
    return response.json()
  } catch(err) {
    console.log(err)
  }
}

/**implement listLatest API in the frontend, you will also need to set up a corresponding fetch
method in api-product.js for this latest products API, */
const listLatest = async (signal) => {
  try {
    let response = await fetch('/api/products/latest', {
      method: 'GET',
      signal: signal
    })
    return response.json()
  } catch(err) {
    console.log(err)
  }
}

/**In order to utilize this related products API in the frontend, we will set up a
corresponding fetch method in api-product.js which will be called
in the Product component with the product ID to populate the Suggestions
component rendered in the product view */
const listRelated = async (params, signal) => {
  try {
    let response = await fetch('/api/products/related/'+params.productId, {
    method: 'GET',
    signal: signal
  })
    return response.json()
  }catch(err) {
  console.log(err)  
  }
}

const listCategories = async (signal) => {
  try {
    let response = await fetch('/api/products/categories', {
      method: 'GET',
      signal: signal
    })
    return response.json()
  } catch(err) {
    console.log(err)
  }
}

/**To utilize this search API in the frontend, we will set up a method that constructs the
URL with query parameters and calls a fetch to make a request to the search product
API. */
const list = async (params, signal) => {
  const query = queryString.stringify(params)
  try {
    let response = await fetch('/api/products?'+query, {
      method: 'GET',
    })
    return response.json()
  }catch(err) {
    console.log(err)
  }
}

export {
  create,
  read,
  update,
  remove,
  listByShop,
  listLatest,
  listRelated,
  listCategories,
  list
}
