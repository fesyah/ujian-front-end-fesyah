import React from 'react'
import NavbarMaterial from '../../components/navbar'
import Footer from '../../components/footer'
import { 
    Table, 
    TableHead, 
    TableRow, 
    TableBody, 
    TableCell, 
    IconButton,
    Collapse,
    Box,
    Typography,

} from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import Axios from 'axios'
import {connect} from 'react-redux'

import {History} from '../../actions'
class TransactionHistoryAdmin extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            history: [], open: false, selId: null
        }
    }

    componentDidMount() {
        Axios.get(`http://localhost:2000/transaction_history`)
        .then(res => {
            console.log(res.data)

            //invoke action history when we going to transaction admin page
            this.props.History(res.data)
        })
        .catch(err => console.log(err))
    }

    handleOpen = (id) =>{
        const {open} = this.state
        this.setState({open: !open, selId: id})
    }

    renderTableHead = () =>{
        return (
            <TableRow>
                <TableCell>#</TableCell>
                <TableCell>No</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Quantity</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Action</TableCell>
                {/* <TableCell>Details</TableCell> */}
            </TableRow>
        )
    }
    
    renderTableBody = () =>{
        const {open, selId  } = this.state
        return this.props.history.map((item, index)=>{
            return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => this.setState({open: !open, selId: index}) }>
                        {selId === index ? open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{item.userID}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.totalQty}</TableCell>
                    <TableCell>Rp. {item.totalPrice.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow key={index}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                <Collapse in={selId === index ? open : false } timeout="auto" unmountOnExit>
                    <Box margin={1}>
                    <Typography variant="h6" gutterBottom component="div">
                        History Details
                    </Typography>
                    <Table size="small" aria-label="purchases">
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell>Color</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {item.products.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <img src={item.images} width='100px' alt='product-image'/>
                                </TableCell>
                                <TableCell component="th" scope="row">{item.name}</TableCell>
                                <TableCell>{item.brand}</TableCell>
                                <TableCell>{item.color}</TableCell>
                                <TableCell>{item.size}</TableCell>
                                <TableCell>{item.qty}</TableCell>
                                <TableCell>Rp. {item.price.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </Box>
                </Collapse>
                </TableCell>
            </TableRow>
          </React.Fragment>
            )
        })
        
    }
    render() {
        return(
            <div style={styles.root}>
                <NavbarMaterial/>
                <div style={styles.container}>
                    <h1 style={styles.title}>Transaction History All User</h1>
                    <h2>Sort By : </h2>
                    <Table style={styles.table}>
                        <TableHead>
                            {this.renderTableHead()}
                        </TableHead>
                        <TableBody>
                            {this.renderTableBody()}
                        </TableBody>
                    </Table>
                </div>
                <Footer/>
            </div>
        )
    }
}

const styles={
    root: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    container:{
        minHeight: 'calc(100vh - 160px)',
        width: '70%',
        margin: '90px auto 30px auto',
    },
    title:{
        textAlign: 'left',
        margin:'1%'
    },
    table: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    }
}

const mapStateToProps = (state) =>{
    return {
       history: state.history 
    }
}

export default connect(mapStateToProps, { History })(TransactionHistoryAdmin)

// export default TransactionHistoryAdmin