import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import {
    Table,
    TableHead,
    TableBody,
    TableFooter,
    TableCell,
    TableRow,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    TextField,
    InputAdornment,
    IconButton
} from '@material-ui/core'

import { LogIn } from '../actions'
import NavbarMaterial from '../components/navbar'
import Footer from '../components/footer'

import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class UserCart extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            products: [],
            alert : false,
            showPassword:false,
            passError: false
        }
    } 

    componentDidMount() {
        Axios.get('http://localhost:2000/products')
        .then((res) => {
            console.log("product", res.data)
            this.setState({ products: res.data })
        }).catch((err) => {
            console.log("Error BOS !", err)
        })
    }

    

    handleDelete = (index) => {
        console.log(index)

        let tempCart = this.props.cart
        tempCart.splice(index, 1)

        // update data database
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart : tempCart })
        .then(res => {
            console.log(res.data)

            // update data redux
            Axios.get(`http://localhost:2000/users/${this.props.id}`)
            .then(res => {
                console.log(res.data)
                this.props.LogIn(res.data)
            })
        })
        .catch(err => console.log(err))
    }

    handleCheckOut = () => {
        console.log('check out')

        if (this.props.cart.length === 0) return
        
        this.setState({alert : true})
    }

    handleClose = () => {
        this.setState({alert : false})
    }

    handleOk = () => {
        const {passError, alert} = this.state

        let history = {
            userID : this.props.id,
            username : this.props.username,
            date : new Date().toLocaleString(),
            totalQty : this.props.cart.map(item => item.qty).reduce((a, b) => a + b),
            totalPrice : this.props.cart.map(item => item.price).reduce((a, b) => a + b),
            products : this.props.cart
        }
        let checkPass = this.password.value

        console.log(history)
        
        // check password
        Axios.get(`http://localhost:2000/users/${this.props.id}`)
        .then(res => {
            console.log(res.data)
            let password = res.data.password
            
            if(password === checkPass){
                // update database
                Axios.post('http://localhost:2000/transaction_history', history)
                .then(res => {
                    console.log(res.data)
                    
                    Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart : [] })
                    .then(res => {
                    console.log(res.data)
                        

                    // update data redux
                    Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then(res => {
                        console.log(res.data)
                        this.props.LogIn(res.data)
                        })
                    })
                })
                this.setState({alert: !alert})
            } else {
                this.setState({passError: !passError})
            }
            
        })
        .catch(err => console.log(err))
    }

    renderTableHead = () => {
        return (
            <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Action</TableCell>
            </TableRow>
        )
    }

    renderTableBody = () => {
        return this.props.cart.map((item, index) => {
            return (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                        <img src={item.images} width='100px'/>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>Rp. {item.price.toLocaleString()}</TableCell>
                    <TableCell>
                    <Button 
                            color="Primary" 
                            variant="contained"
                            onClick={() => this.handleDelete(index)}
                        >Edit</Button>
                        <Button 
                            color="secondary" 
                            variant="contained"
                            onClick={() => this.handleDelete(index)}
                        >Delete</Button>
                    </TableCell>
                </TableRow>
            )
        })
    }

    renderTableFooter = () => {
        let count = 0
        this.props.cart.map((item, index) => {
            count += item.price
        })

        return (
            <TableRow>
                <TableCell colSpan={6}></TableCell>
                <TableCell><Typography style={{ color: 'white' }}>Total Payment</Typography></TableCell>
                <TableCell><Typography style={{ color: 'white' }}> Rp. {count.toLocaleString()}</Typography></TableCell>
                <TableCell>
                    <Button 
                        variant="contained" 
                        style={styles.buttonCheckOut}
                        onClick={this.handleCheckOut}
                    >
                        Check Out
                    </Button>
                </TableCell>
            </TableRow>
        )
    }

    render () {
        const { alert, showPassword, passError } = this.state

        console.log(this.props.cart)
        return (
            <div style={styles.root}>
                <NavbarMaterial/>
                <div style={styles.container}>
                    <h1 style={styles.title}>{this.props.username} Cart</h1>
                    <Table style={styles.table}>
                        <TableHead>{this.renderTableHead()}</TableHead>
                        <TableBody>{this.renderTableBody()}</TableBody>
                        <TableFooter style={styles.tfoot}>{this.renderTableFooter()}</TableFooter>
                    </Table>
                    <Dialog
                        open={alert}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"💳 Confirmation"}</DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure to confrim this payment? <br></br>
                            Please input your password!
                        </DialogContentText>
                        <TextField
                            autoFocus
                            error = {passError}
                            variant='outlined' 
                            placeholder='Password'
                            helperText={passError? 'Invalid password' : ''}
                            inputRef={(password) => this.password = password}
                            type={showPassword? 'text' : 'password'}
                            InputProps={{
                                startAdornment:
                                <InputAdornment position="start">
                                    <LockIcon/>
                                </InputAdornment>,
                                endAdornment:
                                <IconButton position="end" onClick={() => this.setState({showPassword: !showPassword})}>
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            }}
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleOk} color="primary" autoFocus>
                            OK
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <Footer/>
            </div>
        )
    }
}

const styles = {
    root : {
        minHeight : '100vh',
        backgroundColor : '#f2f2f2',
        paddingTop : '90px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

    },
    container:{
        padding: '0 10%'
    },
    title : {
        margin : '2% 0px',
        textTransform: 'capitalize'
    },
    table:{
        backgroundColor: 'white'
    },
    tfoot:{
        backgroundColor: '#1b6ca8', 
        color: 'white' 
    },
    buttonCheckOut : {
        marginTop : '3%',
        color : 'white',
        backgroundColor : '#130f40'
    }
}

const mapStateToProps = (state) => {
    return {
        cart : state.user.cart,
        id : state.user.id,
        username : state.user.username
    }
}

export default connect(mapStateToProps, { LogIn })(UserCart)