import React from 'react'
import {connect} from 'react-redux'
import Axios from 'axios'

import {LogIn} from '../actions'

import {LOGO} from '../assets'

import { 
    TextField,
    Button,
    Checkbox,
    Typography,
    InputAdornment,
    IconButton,
    FormControl,
    FormHelperText
} from '@material-ui/core';
import { Redirect, Link } from 'react-router-dom'
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';



class Login extends React.Component {
    constructor(props){
        super(props)
            this.state = {
                showPassword:false,
                loginError : false,
            }
    }

    handleLogin = () => {
        let username = this.username.value
        let password = this.password.value

        console.log(username)
        console.log(password)
        // get user data using login data
        Axios.get(`http://localhost:2000/users?username=${username}&password=${password}`)
        .then((res) => {
            console.log(res.data)
            if (res.data.length === 0) { // check error
                this.setState({loginError : true})
            } else {
               // set global storage
                localStorage.setItem('id', res.data[0].id)
                
               // invoke action
                this.props.LogIn(res.data[0])
                this.setState({loginError : false})
            }
        })
        .catch((err) => console.log(err))
    }
    
    render(){
        const { showPassword, loginError } = this.state
        console.log(this.props.username)

        // redirect
        if (this.props.username) {
            return <Redirect to='/'/>
        }

        return (
            <div style={styles.root}>
                <Link to='/'>
                    <img src={LOGO} alt="logo"height='70vh'/>
                </Link>
                <div style={styles.containerLogin}>
                <Typography variant='h4'>Login</Typography>
                <FormControl style={styles.formContainer}>
                    <TextField 
                    style={styles.logInput} 
                    variant='outlined' 
                    placeholder='Username'
                    inputRef={(username) => this.username = username}
                    InputProps={{startAdornment:<InputAdornment position="start"><PersonIcon/></InputAdornment>}}
                />
                    <TextField 
                    style={styles.logInput} 
                    variant='outlined' 
                    placeholder='Password'
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
                    <FormHelperText style={styles.error}>{loginError ? '* username or password is invalid' : ''}</FormHelperText>
                </FormControl>
                    <div style={styles.forgetPass}>
                        <div>
                            <Checkbox name="checkedB" color="primary"/>
                            <Typography component= "body2" variant="p">
                                Remember me
                            </Typography>
                        </div>
                        <Typography 
                            component= "body2" 
                            variant="p" 
                            style={{display:'flex', alignItems:'center'}}
                        >
                            <Link style={{color: '#f44336',textDecoration: 'none'}}>
                                Forgot password?
                            </Link>
                        </Typography>
                    </div>
                    <Button variant="contained" color="primary" style={styles.logInput} onClick={() => this.handleLogin()}>Login</Button>
                    <Typography                            
                    component= "body2" 
                    variant="p" 
                    align = 'center'
                    >
                    Don't have an account?&nbsp;
                    <Link to={{pathname:'/register', state:{cek:this.state.cek}}} style={styles.linkSign}>
                        Sign up    
                    </Link>
                </Typography>
                </div>
                
            </div>
        )
    }
}

const styles = {
    root: {
        height : '100vh',
        width : '100%',
        display: 'flex',
        padding: '1vw 0',
        justifyContent:'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundImage : 'url(https://images.wallpaperscraft.com/image/sneakers_shoes_legs_115414_1920x1080.jpg)',
        backgroundRepeat : 'no-repeat',
        backgroundSize : 'cover',
    },
    containerLogin:{
        height:'60vh',
        width:'35vw',
        display: 'flex',
        justifyContent:'space-around',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBottom: '2vw',
        marginBottom: '2vw',      
        opacity : '0.9'
    },
    formContainer:{
        height:'auto',
        width:'100%',
        display: 'flex',
        justifyContent:'space-around',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logInput:{
        width: '70%',
        marginBottom: '2%'
    },
    forgetPass: {
        width: '70%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    linkSign:{
        color: '#f44336',
        textDecoration: 'none',
        fontWeight: 'bold'
    },
    optionLogin:{
        width: '25vw',
        backgroundColor: '#f5f5f5',
        color: 'black'
    },
    optionContainer:{
        height:'20vh',
        display: 'flex',
        marginTop : '2%',
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    error:{
        color: 'red'
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username
    }
    
}

export default connect(mapStateToProps, {LogIn})(Login)