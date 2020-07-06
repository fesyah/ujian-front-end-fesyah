import React from "react";
import Axios from 'axios'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { LogIn, History } from './actions'

// import pages and components
import HomePage from "./pages/homepage";
import Login from './pages/login'
import Register from './pages/register'
import ProductDetails from './pages/productDetails'
import UserCart from './pages/userCart'
import TransactionHistoryAdmin from "./pages/admin/transactionHistoryAdmin";
import NotFound from './pages/404'
import ProfileUser from "./pages/profileUser";
import HistoryUser from "./pages/historyUser";
// import NavbarMaterial from "./components/navbar";
// import Footer from "./components/footer";

class App extends React.Component {
  componentDidMount () {
    // keep login
    Axios.get(`http://localhost:2000/users?id=${localStorage.getItem('id')}`)
    .then(res => {
        this.props.LogIn(res.data[0])
    })
    .catch(err => console.log(err))
}

  render() {
    if(this.props.role === 'admin'){
      return (
          <Switch>
            <Route path="/" component={HomePage} exact/>
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/transaction-history-admin' dataHistory = {this.props.History} component={TransactionHistoryAdmin} />
            <Route path='*' component={NotFound}/>
          </Switch>
      )
    } else{
        return (
            <Switch>              
              <Route path="/" component={HomePage} exact/>
              <Route path='/cart' component={UserCart}/>
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/profile-user' component={ProfileUser}/>
              <Route path='/history-user' component={HistoryUser}/>
              <Route path='/details' component={ProductDetails}/>
              <Route path='*' component={NotFound}/>
            </Switch>
        );
    }
  }
}

const mapToProps = (state) =>{
  return {
    role: state.user.role,
    id: state.user.id
  }
}

export default connect(mapToProps, { LogIn, History })(App)
