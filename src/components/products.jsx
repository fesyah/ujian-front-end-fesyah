import React from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';


class Products extends React.Component{
  constructor(props){
    super(props)
      this.state = { 
        alert: false,
        open: false, 
        wishlist: [false, false, false, false, false, false, false, false, false, false, false, false], 
        toLogin: false
    }
  }

  handleWishlist = (id) => {
    const { wishlist } = this.state
    let tempWish = wishlist
    
    if(this.props.id){
      tempWish[id] = !tempWish[id]
      this.setState({wishlist: tempWish, alert: false})
    } else {
      this.setState({alert: true})
    }
  }

  handleClose = () => {
    this.setState({alert: false, toLogin: true})
  }

  render(){
    const {wishlist, toLogin, open, alert} = this.state

    if (toLogin) {
      return <Redirect to='/login'/>
    }


    return (
      <div style={styles.root}>
        <h1 style={styles.title}>Products</h1>
        <div style={styles.cardContainer}>
          {this.props.dataProducts.map((item,index) => {
            return (
              <Card  className = 'card-box' style={styles.card}>
                <CardActionArea style={styles.contentArea}>
                  <CardMedia image={item.images[0]} component="img" style={styles.contentImage} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="p">
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {`Rp. ${item.price.toLocaleString()}, 00`}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions style={styles.contentActions}>
                  <Link to={{pathname:'/details', search:`id=${item.id}`}} style={styles.btnBuy}>
                    <Button 
                      size="small" 
                      color="primary"
                      startIcon={<ShoppingCartIcon/>}>
                      Buy Now
                    </Button> 
                  </Link>
                  <Button
                    // variant = 'containedSecondary'
                    size="small" 
                    color="secondary"
                    onClick = {() => this.handleWishlist(index)}
                    startIcon={wishlist[index] ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                  >
                    Wish List
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        <Dialog
            open={alert}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"⚠ Warning !"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You are not logged in. Please Log in to input some item to your wishlist
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.handleClose} color="primary">
                Ok
            </Button>
            </DialogActions>
        </Dialog>
        </div>
      </div>
    );
  }
}

const styles = {
  root: {
    height : 'auto',
    width : '100%',
    backgroundColor : '#f2f2f2',
    padding : '2% 7%',
    display:'flex',
    justifyContent:'center',
    flexDirection:'column'
  },
  title : {
    fontSize : 50,
    fontWight : 600,
    margin : '2% 0px',
    paddingLeft: '4%'
},
cardContainer : {
    width : '100%',
    display : 'flex',
    flexWrap : 'wrap',
    justifyContent : 'center'
},
card : {
    flexBasis : '19%',
    minWidth : '300px',
    marginBottom : '1%',
    marginRight : '1%',
},
contentArea : {
    height : '87%',
    padding : '1%'
},
contentImage : {
    width : '100%',
    padding : '5%'
},
contentActions : {
    height : '13%',
    alignItems : 'center'
},
btnBuy:{
  textDecoration: 'none'
}
};
const mapStateToProps = (state) => {
  return {
    id: state.user.id
  }
}
export default connect(mapStateToProps)(Products);
