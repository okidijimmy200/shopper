import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import NewShop from './shop/NewShop'
import Shops from './shop/Shops'
import MyShops from './shop/MyShops'
import Shop from './shop/Shop'
import EditShop from './shop/EditShop'
import NewProduct from './product/NewProduct'
import EditProduct from './product/EditProduct'
import Product from './product/Product'
import Cart from './cart/Cart'
import StripeConnect from './user/StripeConnect'
import ShopOrders from './order/ShopOrders'
import Order from './order/Order'

const MainRouter = () => {
  return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={Profile}/>

        <Route path="/cart" component={Cart}/>
        <Route path="/product/:productId" component={Product}/>
  {/* The Shops component will be accessed by the end user at /shops/all, which is set
up with React Router and declared in MainRouter.js wch will redirect the user to a view
displaying all the shops in the marketplace. */}
        <Route path="/shops/all" component={Shops}/>
{/* This route can be used in any component to link to a specific shop, and this link will
take the user to the corresponding Shop view with the shop details loaded. */}
        <Route path="/shops/:shopId" component={Shop}/>

        <Route path="/order/:orderId" component={Order}/>
        <PrivateRoute path="/seller/orders/:shop/:shopId" component={ShopOrders}/>
{/* The MyShops component can only be viewed by a signed-in user who is also a seller.
So we will add a PrivateRoute in the MainRouter component, which will render
this component only for authenticated users at /seller/shops */}
        <PrivateRoute path="/seller/shops" component={MyShops}/>
    {/* The NewShop component can only be viewed by a signed-in user who is also a seller.
So we will add a PrivateRoute in the MainRouter component, that will render this form only for authenticated users at */}
{/* ------------------------------------------------------------------------------------ */}
{/* This link can be added to any of the view components that may be accessed by the
seller, for example in a view where a seller manages their shops in the marketplace. */}
        <PrivateRoute path="/seller/shop/new" component={NewShop}/>
        {/* The EditShop component will only be accessible by authorized shop owners. So we
will add a PrivateRoute in the MainRouter component */}
        <PrivateRoute path="/seller/shop/edit/:shopId" component={EditShop}/>
        <PrivateRoute path="/seller/:shopId/products/new" component={NewProduct}/>
        <PrivateRoute path="/seller/:shopId/:productId/edit" component={EditProduct}/>

        <Route path="/seller/stripe/connect" component={StripeConnect}/>
      </Switch>
    </div>)
}

export default MainRouter
