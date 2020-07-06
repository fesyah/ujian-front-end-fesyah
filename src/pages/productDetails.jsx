import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Footer from '../components/footer'
import NavbarMaterial from '../components/navbar'
import Slider from "react-slick";
import {
    Button, 
    Typography, 
    Paper, 
    ExpansionPanel, 
    ExpansionPanelSummary, 
    ExpansionPanelDetails,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { LogIn } from '../actions'

class ProductDetails extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            product : {}, 
            stock: 0, 
            size: null,
            selId: null, 
            total: 0, 
            toCart: false, 
            alert: false
        }
    }
    
    componentDidMount () {
        Axios.get(`http://localhost:2000/products${this.props.location.search}`)
        .then(res => {
            console.log(res.data)
            this.setState({product : res.data[0]})
        })
        .catch(err => console.log(err))
    }

    handleAddToCart = () =>{
        const {total, product, selId, size} = this.state

        console.log(`input stock: ${total}`)
        if(selId === null || total === 0 ){
            this.setState({alert:true})
            return
        }

        if(!this.props.id){
            this.setState({alert: true})
        } else {
            console.log('user already login')
            let cartData = {
                id: product.id,
                images: product.images[0],
                name : product.name,
                brand : product.brand,  
                color: product.colour,
                size: size,
                qty: total,
                price: total * product.price
        }
            // if(this.props.cart)
            console.log(cartData)
            let tempCart = this.props.cart
            console.log(tempCart)
            tempCart.map((item,index) => {
                    if(item.id === cartData.id && item.size === cartData.size){
                        console.log(`item : ${item.id}, value: ${cartData.id}, index: ${index}`)
                        cartData.qty += item.qty
                        tempCart.splice(index, 1)
                    }
            })

            tempCart.push(cartData)
                
            
            // update user cart in database
            Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart : tempCart })
            .then(res => {
                console.log(res.data)

                // update data redux
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                .then(res => {
                    this.props.LogIn(res.data)
                    this.setState({toCart : true})
                })
            })
            .catch(err => console.log(err))
        }
    }

    handleClose = () => {
        if(!this.props.id){
            this.setState({alert: false, toLogin: true})
        } else {
            this.setState({alert: false})
        }
    }

    render () {
        const { product, total, stock, toLogin, selId, alert, toCart, size } = this.state

        
        console.log(size)
        if (toLogin) {
            return <Redirect to='/login'/>
        } else if (toCart) {
            return <Redirect to='/cart'/>
        }

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
          };

        return (
            <div style={styles.root}>
                <NavbarMaterial/>
                <Paper style={styles.container} elevation={6}>
                    <div style={styles.containerLeft}>
                    <Slider {...settings} style={styles.slider}>
                            {(product.images? product.images : []).map(item => {
                                return (
                                    <img src={item} height='460px' style={styles.content} alt='product-image'/>
                                )
                            })}
                    </Slider>
                    </div>
                    <div style={styles.containerRight}>
                        {
                        product !== null ?
                        <div style={styles.contentLeft}>
                            <div>
                            <h1 style={styles.info}>Name : {product !== null ? product.name : null}</h1>
                            <h1 style={styles.info}>Price : Rp.{(product.price | '').toLocaleString()}</h1> 
                            <h1 style={styles.info}>Category : {product.category}</h1>
                            <h1 style={styles.info}>Brand : {product.brand}</h1>
                            <h1 style={styles.info}>Color : {product.colour}</h1>
                            <ExpansionPanel style={{margin: '20px 0', backgroundColor : '#111d5e', color : 'white'}}>
                                <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                                >
                                <Typography>Description</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                <Typography>
                                    {product.description}
                                </Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            </div>
                            <div>
                            <h1 style={styles.info}>Size : </h1>
                            {(product.stock? product.stock : []).map((item, index)=>{
                                return(
                                    <Button 
                                        variant="outlined" 
                                        color="primary"
                                        onClick={() => this.setState({stock : item.total, selId : index, size : item.code})}
                                        style={{backgroundColor: selId === index ? 'darkblue' : '', 
                                                color: selId === index ? 'white' : '',        
                                                marginRight: '10px', marginTop: '10px', marginBottom: '20px'}}
                                    >
                                            {item.code}
                                    </Button>
                                )
                            })}
                                    <Typography variant='p'>{stock? `Stock: ${stock}` : ''}</Typography> 
                                    <div style={{display:'flex'}}>
                                            <button 
                                                disabled={total <= 0 ? true : false}
                                                variant="outlined"
                                                style={{width:'50px'}}
                                                onClick={() => this.setState({total : total-1})}>-</button>
                                            <h1 style={styles.totalInfo}>{total}</h1>
                                            <button 
                                                disabled={total >= stock ? true : false}
                                                variant="outlined"
                                                style={{width:'50px'}}
                                                onClick={() => this.setState({total : total+1})}>+</button>
                                            &nbsp;&nbsp;
                                            <Button
                                                variant="contained"
                                                color="default"
                                                style={styles.buttonCart}
                                                startIcon={<AddShoppingCartIcon/>}
                                                onClick={this.handleAddToCart}
                                            >
                                                Add To Cart
                                            </Button>
                                    </div>
                                    <Dialog
                                        open={alert}
                                        onClose={this.handleClose}
                                        aria-labelledby="alert-dialog-slide-title"
                                        aria-describedby="alert-dialog-slide-description"
                                    >
                                        <DialogTitle id="alert-dialog-slide-title">{"⚠ Warning !"}</DialogTitle>
                                        <DialogContent>
                                        <DialogContentText id="alert-dialog-slide-description">
                                            {!this.props.id ? 'You are not logged in. Please Log in to buy some item' : 'Please choose your size, look at the stock if its avaiable, and input total or quantity min = 1.'}
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
                        :
                        null
                        }
                    </div>
                </Paper>
                <Footer/>
            </div>
        )
    }
}

const styles = {
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        height: `calc(100vh - 220px)`,
        width: '80vw',
        backgroundColor: '#f2f2f2',
        margin: '120px 50px 30px 50px', 
        display: 'flex',
    },
    info : {
        fontSize : 16,
        marginBottom : '2%',
        fontWeight : 600,
        textTransform : 'capitalize'
    },
    containerLeft: {
        height: '90%',
        width: '46%',
        marginLeft: '30px',
        paddingTop: '60px'
    },
    slider: {
        height: '100%',
        width: '100%',
        padding: '200px 0',
        // backgroundColor: 'aqua',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content : {
        padding: '50px',
    },
    contentLeft:{
        // display: 'flex',
        // flexDirection: 'column'
    },
    containerRight:{
        padding: '2%',
        overflow: 'scroll'
    },
    totalInfo:{
        margin : '0px 2%'
    },
    buttonCart : {
        backgroundColor: "#c4fb6d",
        color: "#fff",

    }
}

const mapStateToProps = (state) => {
    return {
        id : state.user.id,
        cart : state.user.cart
    }
}

export default connect(mapStateToProps, { LogIn })(ProductDetails)