import React from 'react'
import { 
    Button,
    Checkbox,
    Typography,
    InputAdornment,
    IconButton,
    FormControl,
    OutlinedInput,
    FormHelperText
 } from '@material-ui/core'

import {Link, Redirect} from 'react-router-dom'
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


import {LOGO} from '../assets'
import Axios from 'axios';

const URL = 'http://localhost:2000/'

class Register extends React.Component {
    constructor(props){
        super(props)
            this.state = {
                users: [],
                filter: [],
                checked: false,
                checkedText: '',
                showPassword:false,
                regStatus: false, 
                errorUsername : false, 
                errorEmail : false, 
                errorPass : false, 
                errorConfPass : false,
                redirect : false,
                errorTextUsername : 'Username must be at least 6 characters combination of letters and numbers.', 
                errorTextEmail : 'Example: yourmail@domain.com.', 
                errorTextPass : 'Password must be at least 6 characters combination of letters, numbers, and symbol.', 
                errorTextConfPass : 'Confirm password must be matched with password.'
            }
    }

    componentDidMount() {
        this.getData('users')
    }

    getData = (address) => {
        Axios.get(URL + address)
        .then(response => {
            if(address === 'users'){
                this.setState({users: response.data})
            } else {
                this.setState({filter: response.data})
            }
            console.log(response.data)
        })
        .catch(error => console.log(error))
    }

    handleUsername = (event) => {
        let username = event.target.value
        let letter = /([a-z]|[A-Z])/
        let number = /[0-9]/
        let symbol = /[!@$%^*;]/

        console.log(username)
        console.log(Boolean(username))

        let letterTest = letter.test(username)
        let numberTest = number.test(username)
        let symbolTest = !symbol.test(username)
        let minUser = username.length > 5

        console.log((this.state.users.filter(item=>item.username === username)))
        if(username === ''){
            this.setState({errorTextUsername: 'Username must be at least 6 characters combination of letters and numbers', errorUsername: true})
        } else if(this.state.users.filter(item=>item.username === username).length>0){
            this.setState({errorTextUsername: 'Username is already use', errorUsername: true})
        } else if(letterTest && numberTest && symbolTest && minUser){
            this.setState({errorTextUsername: 'Correct username', errorUsername: false})
        } else {
            this.setState({errorTextUsername: 'Incorrect username.', errorUsername: true})
        }
    }

    handleEmail = (event) => {
        let email = event.target.value
        let regexEmail = /^([a-z]|[0-9]|[A-Z])+([\.-]?([a-z]|[0-9]|[A-Z])+)*@([a-z]){2,}([\.]?[a-z]{2,})*(\.[a-z]{2,3})+$/
        let emailTest = regexEmail.test(email)

        if(email === ''){
            this.setState({errorTextEmail: 'Example: yourmail@domain.com', errorEmail: true})
        } else if(this.state.users.filter(item=>item.email === email).length>0){
            this.setState({errorTextEmail: 'Email is already use', errorEmail: true})
        } else if(emailTest){
            this.setState({errorTextEmail: 'Correct email', errorEmail: false})
        } else {
            this.setState({errorTextEmail: 'Incorrect email.', errorEmail: true})
        }
    }

    handlePass = (event) => {
        let password = event.target.value
        let upperCase = /[a-z]/
        let lowerCase = /[A-Z]/
        let number = /[0-9]/
        let symbol = /[!@$%^*;]/

        let upperTest = upperCase.test(password)
        let lowerTest = lowerCase.test(password)
        let numberTest = number.test(password)
        let symbolTest = symbol.test(password)
        let minPass = password.length > 5

        if(password === false){
            this.setState({errorTextPass:'Password must be at least 6 characters combination of letters, numbers, and symbol.', errorPass: true})
        } else if(upperTest && lowerTest && numberTest && symbolTest && minPass){
            this.setState({errorTextPass: 'Correct password.', errorPass: false })
        } else{
            this.setState({errorTextPass: 'Incorrect password', errorPass: true })
        }
    }

    handleConfPass = (event) => {
        let confPass = event.target.value
        let pass = this.password.value
        console.log(pass)
        
        if(confPass === false){
            this.setState({errorTextConfPass: 'Confirm password must be matched with password.', errorConfPass: true })
        } else if(confPass === pass){
            this.setState({errorTextConfPass: 'Confirm password already match.', errorConfPass: false })
        } else{
            this.setState({errorTextConfPass: 'Confirm password doesn\'t match.', errorConfPass: true })
        }
    }

    handleRegister = () =>{
        let {errorUsername, errorEmail, errorPass, errorConfPass, checked} = this.state

        
        let username = this.username.value,
        email = this.email.value,
        password = this.password.value,
        confirmPassword = this.confirmPassword.value

        console.log({user: username, email: email, password:password, confirmPassword:confirmPassword})

        if(username!== '' && email !== '' && password !== '' && confirmPassword!=='' && checked){
            if(!errorUsername && !errorEmail && !errorPass && !errorConfPass){
                Axios.post('http://localhost:2000/users',{
                    username: username,
                    password: password,
                    role: 'user',
                    email: email,
                    cart: []
                }) .then(response => {
                    console.log(response.data)
                    this.setState({users: response.data, regStatus: true})
                }) .catch(error => {
                    console.log(error)
                })
                console.log(this.state.users)
                this.setState({checkedText: '', redirect: true})
            }
        } else{
                this.setState({checkedText: 'Your input incorrect. Please try again!'})
            }

    }

    render(){
        const {
            showPassword,
            checked,
            checkedText,
            errorTextUsername,
            errorTextEmail,
            errorTextPass,
            errorTextConfPass, 
            errorUsername, 
            errorEmail, 
            errorPass, 
            errorConfPass,
            redirect
        } = this.state
        console.log(this.state.checked)

        //redirect
        if (redirect) {
            return <Redirect to='/login'/>
        }

        return (
            <div style={styles.root}>
                <Link to='/'>
                    <img src={LOGO} alt="logo"height='60vh'/>
                </Link>
                <div style={styles.containerRegister}>
                    <Typography variant='h4' style={{marginBottom: '2vw'}}>Register</Typography>
                    {/* <div style={styles.register}> */}
                    <FormControl variant="outlined" style={styles.regInput}>
                        <OutlinedInput 
                            id="outlined-adornment-weight"
                            placeholder='Username'
                            error={errorUsername}
                            inputRef={(username) => this.username = username}
                            onChange = {(e) => this.handleUsername(e)}
                            startAdornment = {<InputAdornment position="start"><PersonIcon/></InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                            'aria-label': 'weight'
                            }}
                            labelWidth={0}
                        />
                        <FormHelperText 
                            id="outlined-weight-helper-text"
                            style={errorUsername? styles.error: styles.default}>
                                {errorTextUsername}
                        </FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined" style={styles.regInput}>
                        <OutlinedInput 
                            id="outlined-adornment-weight"
                            placeholder='Email'
                            error = {errorEmail}
                            inputRef={(email) => this.email = email}
                            onChange = {(e) => this.handleEmail(e)}
                            startAdornment = {<InputAdornment position="start"><EmailIcon/></InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                            'aria-label': 'weight'
                            }}
                            labelWidth={0}
                        />
                        <FormHelperText 
                            id="outlined-weight-helper-text"
                            style={errorEmail? styles.error: styles.default}>
                                {errorTextEmail}
                        </FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined" style={styles.regInput}>
                        <OutlinedInput 
                            id="outlined-adornment-weight"
                            placeholder='Password'
                            error = {errorPass}
                            inputRef={(password) => this.password = password}
                            onChange = {(e) => this.handlePass(e)}
                            type = {showPassword? 'text' : 'password'}
                            startAdornment = {<InputAdornment position="start"><LockIcon/></InputAdornment>}
                            endAdornment = {<IconButton position="end" onClick={() => this.setState({showPassword: !showPassword})}>
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'weight'
                            }}
                            labelWidth={0}
                        />
                        <FormHelperText 
                            id="outlined-weight-helper-text"
                            style={errorPass? styles.error: styles.default}>
                                {errorTextPass}
                        </FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined" style={styles.regInput}>
                        <OutlinedInput 
                            id="outlined-adornment-weight"
                            placeholder='Confirm Password'
                            error = {errorConfPass}
                            inputRef={(confirmPassword) => this.confirmPassword = confirmPassword}
                            onChange = {(e) => this.handleConfPass(e)}
                            type = {showPassword? 'text' : 'password'}
                            startAdornment = {<InputAdornment position="start"><LockIcon/></InputAdornment>}
                            endAdornment = {<IconButton position="end" onClick={() => this.setState({showPassword: !showPassword})}>
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                            'aria-label': 'weight'
                            }}
                            labelWidth={0}
                        />
                        <FormHelperText 
                            id="outlined-weight-helper-text"
                            style={errorConfPass? styles.error: styles.default}>
                                {errorTextConfPass}
                        </FormHelperText>
                    </FormControl>
                        <div style={styles.rule}>
                            <Checkbox
                                name="checkedB"
                                color="primary"
                                inputRef = {(checked) => this.checked = checked}
                                onClick = {() => this.setState({checked: !checked})}
                            />
                            <Typography component= "body2" variant="p">
                                By signing up, you agree to our 
                                <Link style={styles.ruleContent}> Terms of Use </Link> 
                                and 
                                <Link style={styles.ruleContent}> Privacy Policy. </Link>
                            </Typography>
                        </div>
                        <FormHelperText style={styles.error}>{checkedText}</FormHelperText>
                        <Button variant="contained" color="primary" style={{width: '70%'}} onClick={() => this.handleRegister()}>Register</Button>
                        <Typography                            
                        component= "body2" 
                        variant="p" 
                        align = 'center'
                >
                    Already have an account?&nbsp;
                    <Link to='/login' style={styles.login}>
                        Log in   
                    </Link>
                </Typography>
                    {/* </div> */}
                </div>
                
            </div>
        )
    }
}

const styles = {
    root: {
        width:'100%', 
        height: 'auto',
        display: 'flex',
        padding: '1vw 0',
        justifyContent:'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundImage : 'url(https://images.wallpaperscraft.com/image/sneakers_shoes_legs_115414_1920x1080.jpg)',
        backgroundRepeat : 'no-repeat',
        backgroundSize : 'cover',
    },
    containerRegister: {
        height:'90vh',
        width:'35vw',
        display: 'flex',
        justifyContent:'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: '2vw',
        opacity : '0.9'
        
    },
    regInput:{
        width:'70%',
        marginBottom: '1vw',
    },
    rule: {
        width:'70%',
        display: 'flex',
        marginBottom: '1vw',
        justifyContent: 'center',
        alignItem: 'center'
    },
    ruleContent:{
        color: '#f44336',
        textDecoration: 'none',
        
    },
    login: {
        color: '#f44336',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop : '7%',
    },
    optionRegister:{
        width: '25vw',
        backgroundColor: '#f5f5f5',
        color: 'black',
        marginBottom : ''
    },
    error:{
        color: '#f44336'
    },
    default:{
        color: '#bdbdbd'

    }
}

export default Register