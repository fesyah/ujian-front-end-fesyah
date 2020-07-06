import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Badge,
  Typography,
  Popover,
  MenuItem,
} from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Link } from "react-router-dom";
import Profile from "./profile"
import {LOGO} from '../assets'

import { connect } from 'react-redux'

class NavbarMaterial extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
          anchorEl : null,
          open: false,
          logOutError: false
      }
    }
  handlePopoverOpen = (event) => {
    if(this.props.role === 'user')
      return this.setState({anchorEl : event.currentTarget, open: !this.state.open})
  };

  handlePopoverClose = () => {
    this.setState({anchorEl : null, open: false})
  };

  renderPopOver = () =>{
    return(
      <Popover
        id="mouse-over-popover"
        borderRadius = '50%'
        open={Boolean(this.state.anchorEl)}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={this.handlePopoverClose}
        disableRestoreFocus
      >
        <div style={styles.popoverTitle}>
          <Typography >Total({this.props.cart.map(item => item.qty).reduce((a,b) => a + b, 0)})</Typography>
        </div>
        <div style={styles.popoverContent}>
          {(this.props.cart).map(item =>{
          return(
            <div>
              <div>
                <MenuItem>
                  <img src={item.images} width='70px'/>
                </MenuItem>
              </div>
              <div>
                <MenuItem>{item.name}</MenuItem>
                <MenuItem>{item.qty} item</MenuItem>
                <MenuItem>Rp. {item.price.toLocaleString()}</MenuItem>
              </div>
              {/* <div>
              <Button style={styles.cartButton}>Go to Cart</Button>
              </div> */}
            </div>
          )
        })}
        </div>
        <div>
            <Link to='/cart'>
              <Button style={styles.cartButton}>Go to Cart</Button>
            </Link>
        </div>
    </Popover>
    )
  }
  render() {
    let count = 0
    this.props.cart.map((item) => {
        count += item.price
    })

    return (
        <AppBar position="fixed" style={styles.root} elevation={0}>
          <Toolbar style={styles.toolbar}>
            <div style={styles.leftContent}>
              <Link to="/" style={styles.menu}>
                <img src={LOGO} alt="logo"height='50px'/>
                <h1 style={styles.menuTitle}>Home</h1>
              </Link>
            </div>
            <div style={styles.rightContent}>
              <div style={styles.cart}>
                <IconButton 
                  aria-label="cart"
                  onClick={(e) => this.handlePopoverOpen(e)}
                  > 
                  <Badge badgeContent={this.props.cart.map(item => item.qty).reduce((a,b) => a + b, 0)} color="primary">
                    <ShoppingCartIcon
                    />
                  </Badge>
                </IconButton>
                {this.renderPopOver()}
                <h6 style={styles.cartTotal}>Rp. {count.toLocaleString()}</h6>
              </div>
              <Profile/>
            </div>
          </Toolbar>
        </AppBar>
    );
  }
}

const styles = {
  root : {
      height : 90,
      padding : '2% 7%',
      display : 'flex',
      justifyContent : 'center',
      backgroundColor: 'rgba(30,39,46,0.3)'
  },
  toolbar : {
      display : 'flex',
      justifyContent : 'space-between',
      padding : 0
  },
  leftContent : {
      height : '100%',
      flexBasis : '50%',
      maxWidth : '50%',
      display : 'flex',
      justifyContent : 'flex-start',
      alignItems : 'center'
  },
  menu : {
      paddingLeft : '3%',
      fontSize : 12,
      cursor : 'pointer',
      color: '#f2f2f2',
      textDecoration: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
  },
  menuTitle:{
    marginLeft: '20px'
  },
  rightContent : {
      height : '100%',
      flexBasis : '50%',
      display : 'flex',
      justifyContent : 'flex-end',
      alignItems : 'center'
  },
  cart : {
      height : '100%',
      display : 'flex',
      alignItems : 'center',
      marginRight : 15
  },
  cartTotal : {
      fontSize : 16,
      marginLeft : 15
  },
  popover:{
    width: '500px'
  },
  popoverTitle: {
    width: '400px', 
    zIndex: 3, 
    position: 'fixed', 
    backgroundColor: '#f2f2f2', 
    borderBottom: '1px solid gray', 
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
  },
  popoverContent: {
    width:400, 
    height: 300, 
    marginTop: 40,  
    overflowX:'hidden'
},
  linkCartTitle: {
    textDecoration: 'none',
    color: 'blue'
  },
  cartPopOver:{
    display: 'flex',
    flexDirection: 'column',
    width: '300px'
  },
  cartButton: {
    textDecoration : 'none',
    width : '100%',
    marginTop : 10,
    backgroundColor : '#130f40',
    color : 'white'
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.user.cart,
    role : state.user.role
  }
}

export default connect(mapStateToProps)(NavbarMaterial);
