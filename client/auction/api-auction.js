/**to make a request to this create API, we will set up a fetch method
on the client-side to make a POST request to the API route and pass it the multipart
form data containing details of the new auction in the body. */
const create = async (params, credentials, auction) => {
    try {
      let response = await fetch('/api/auctions/by/'+ params.userId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: auction
      })
        return response.json()
      } catch(err) { 
        console.log(err)
      }
  }
  
  /**To fetch this API in the frontend, we will add a corresponding listOpen method
in api-auction.js, similar to other API implementations. This fetch method will be
used in the frontend component that displays the open auctions to the user */
  const listOpen = async (signal) => {
    try {
      let response = await fetch('/api/auctions', {
        method: 'GET',
        signal: signal
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }
  /**To fetch this API in the frontend, we will add a
corresponding listBySeller method in api-auction.js, similar to other API
implementations. This fetch method will be used in the frontend component that
displays the auctions related to a specific seller. */
  const listBySeller = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/auctions/by/'+params.userId, {
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
  
  /**To fetch this API in the frontend, we will add a
corresponding listByBidder method in api-auction.js, similar to other API
implementations. This fetch method will be used in the frontend component that
displays the auctions related to a specific bidder. */
  const listByBidder = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/auctions/bid/'+params.userId, {
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
  
  /**will use the fetch method to call the read auction API in a React
component that will render the retrieved auction details. */
  const read = async (params, signal) => {
    try {
      let response = await fetch('/api/auction/' + params.auctionId, {
        method: 'GET',
        signal: signal,
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }
  
  const update = async (params, credentials, auction) => {
    try {
      let response = await fetch('/api/auctions/' + params.auctionId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: auction
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/auctions/' + params.auctionId, {
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
    listOpen,
    listBySeller,
    listByBidder,
    read,
    update,
    remove
  }
  