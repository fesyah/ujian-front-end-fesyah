import React from 'react'
import { connect } from 'react-redux'
import { 
    IconButton, 
    Avatar,
    Menu,
    MenuItem,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import PersonIcon from '@material-ui/icons/Person';

import { LogOut } from '../actions'

class Profile extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            anchorEl : null,
            logOutError: false
        }
    }

    handleClick = (event) => {
        console.log(event)
        this.setState({anchorEl : event.currentTarget})
    }

    handleClose = () => {
        this.setState({anchorEl : null})
    }

    handleLogOut =  () => {
        const {logOutError} = this.state
        localStorage.clear()
        this.props.LogOut()
        this.setState({logOutError: !logOutError})    
    }

    render () {
        return (
            <div>
                <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => this.handleClick(e)}>
                    {
                        this.props.username ?
                        <Avatar style={{backgroundColor : '#130f40'}}>{this.props.username.charAt(0).toUpperCase()}</Avatar> :
                        <Avatar><PersonIcon/></Avatar>
                    }
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    getContentAnchorEl={null}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {
                        this.props.role ?
                        this.props.role === 'admin' ?
                        <div>
                            <Link style={styles.menuLogin} >
                                <MenuItem>Product Management</MenuItem>
                            </Link>
                            <Link to='/account-management' style={styles.menuLogin}>
                                <MenuItem>Account Management</MenuItem>
                            </Link>
                            <Link to='/transaction-history-admin' style={styles.menuLogin}>
                                <MenuItem>Transaction History</MenuItem>
                            </Link>
                            <Link style={styles.menuLogin} to='/'>
                                <MenuItem onClick={this.handleLogOut}>Logout</MenuItem>
                            </Link>
                        </div>
                        :
                        <div>
                            <Link to='/profile-user' style={styles.menuLogin} >
                                <MenuItem>Profile</MenuItem>
                            </Link>
                            <Link to='/cart' style={styles.menuLogin}>
                                <MenuItem>Cart</MenuItem>
                            </Link>
                            <Link to='/history-user' style={styles.menuLogin}>
                                <MenuItem>History</MenuItem>
                            </Link>
                            <Link style={styles.menuLogin} to='/'>
                                <MenuItem onClick={this.handleLogOut}>Logout</MenuItem>
                            </Link>
                        </div>
                        :
                        <div>
                            <Link to='/login' style={styles.menuLogin}>
                                <MenuItem>Login</MenuItem>
                            </Link>
                            <Link to='/register' style={styles.menuLogin}>
                                <MenuItem>Register</MenuItem>
                            </Link>
                        </div>
                    }
                </Menu>
            </div>
        )
    }
}

const styles = {
    menuLogin: {
        color: 'gray',
        textDecoration: 'none',
        fontWeight: 'bold'
    }
}

const mapStateToProps = (state) => {
    return {
        username : state.user.username,
        role : state.user.role
    }
}

export default connect(mapStateToProps, { LogOut })(Profile)