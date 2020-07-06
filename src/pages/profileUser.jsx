import React from 'react'
import { connect } from 'react-redux'
import NavbarMaterial from '../components/navbar'
import Footer from '../components/footer'
import { 
    Paper, 
    Table, 
    TableRow, 
    TableCell, 
    Button, 
    IconButton,
    FormControl,
    OutlinedInput,
    FormHelperText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@material-ui/core'
import Axios from 'axios'
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import {LogIn} from '../actions'

const URL = 'http://localhost:2000'

class ProfileUser extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            users: [], 
            alert : false,
            showPassword:false,
            indexName: false, 
            indexEmail: false, 
            indexPassword: false, 
            errorUsername: false,
            errorEmail : false, 
            errorCurrentPass : false, 
            errorPass : false, 
            errorConfPass : false,
            errorTextUsername : 'Username must be at least 6 characters.', 
            errorTextEmail : 'Example: yourmail@domain.com.', 
            errorTextCurrentPass : 'Input your current password.',
            errorTextPass : 'Password must be at least 6 characters combination of letters, numbers, and symbol.', 
            errorTextConfPass : 'Confirm password must be matched with password.', 
        }
    }
    
    componentDidMount() {
        Axios.get(`${URL}/users?id=${localStorage.getItem('id')}`)
        .then(res => {
            console.log(res.data)
            this.setState({users: res.data})
        })
        .catch(err => console.log(err))
    }

    getData = () =>{
        Axios.get(`http://localhost:2000/users?id=${this.props.id}`)
        .then(res => {
            console.log(res.data)
            this.setState({users: res.data})
        })
        .catch(err => console.log(err))
    }

    patchData = (userName = this.state.users.username, emailName = this.state.users.username, pass = this.state.users.password ) => {
        Axios.patch(`${URL}/users/${this.props.id}`, {
            username : userName,
            email : emailName,
            password : pass
        })
        .then(res => {
            console.log(res.data)
            this.setState({users: res.data})
            this.props.LogIn(res.data)
        })
        .catch(err => console.log(err))
    }

    handleEditName = () =>{
        const {indexName} = this.state
        let email, password
        let username = this.username.value
        
        if(username !== ''){
            this.patchData(username, email, password)
            this.setState({indexName : !indexName})
        } else {
            this.setState({alert : true})
        }
    }

    handleEditEmail = () =>{
        const {indexEmail} = this.state
        let username, password
        let email = this.email.value

        if(email !== ''){
            this.patchData(username, email, password)
            this.setState({indexEmail : !indexEmail})
        } else {
            this.setState({alert : true})
        }
    }
    
    handleEditPass = () => {
        const {indexPassword, errorCurrentPass, errorConfPass, errorPass} = this.state
        let username, email
        let currentPassword = this.currentPassword.value
        let newPassword = this.password.value
        let confirmPassword = this.confirmPassword.value
        
        if(currentPassword !== '' && newPassword !== '' && confirmPassword !== ''){
            if(!errorCurrentPass && !errorPass && !errorConfPass){
                this.patchData(username, email, newPassword)
                this.setState({indexPassword : !indexPassword})
            }
        } else {
            this.setState({alert : true})
        }
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
        } else if(this.state.users[0].email === email){
            this.setState({errorTextEmail: 'Email is already use', errorEmail: true})
        } else if(emailTest){
            this.setState({errorTextEmail: 'Correct email', errorEmail: false})
        } else {
            this.setState({errorTextEmail: 'Incorrect email.', errorEmail: true})
        }
    }

    handleCurrentPass = (event) =>{
        let currentPassword = event.target.value
        if(currentPassword === false){
            this.setState({errorTextCurrentPass:'Input your current password.', errorCurrentPass: true})
        } else if(currentPassword === this.state.users[0].password){
            this.setState({errorTextCurrentPass: 'Correct password', errorCurrentPass: false })
        } else{
            this.setState({errorTextCurrentPass:'Incorrect password', errorCurrentPass: true})
        }
    }

    handlePass = (event) => {
        let currentPassword = this.currentPassword.value
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

        if(password === currentPassword){
            this.setState({errorTextPass:'Your new password same with old password', errorPass: true})
        } else if(password === false){
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
            this.setState({errorTextConfPass: 'Confirm password already matched.', errorConfPass: false })
        } else{
            this.setState({errorTextConfPass: 'Confirm password doesn\'t match.', errorConfPass: true })
        }
    }

    renderTable = () =>{
        const { 
            showPassword,
            indexName, 
            indexEmail, 
            indexPassword, 
            errorUsername, 
            errorTextUsername,
            errorEmail,
            errorTextEmail,
            errorCurrentPass,
            errorTextCurrentPass,
            errorPass,
            errorTextPass,
            errorConfPass,
            errorTextConfPass
        } = this.state

            return (
                <Table style={styles.table}>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>
                            {indexName ? 
                            <FormControl variant="outlined" style={styles.regInput}>
                                <OutlinedInput 
                                    placeholder='Username'
                                    error={errorUsername}
                                    placeholder={this.props.username}
                                    defaultValue={this.props.username}
                                    inputRef={(username) => this.username = username}
                                    onChange = {(e) => this.handleUsername(e)}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                    'aria-label': 'weight'
                                    }}
                                />
                                <FormHelperText 
                                    id="outlined-weight-helper-text"
                                    style={errorUsername? styles.error: styles.default}>
                                        {errorTextUsername}
                                </FormHelperText>
                            </FormControl>

                            : 
                            this.props.username}
                        </TableCell>
                        <TableCell>
                            {indexName ?
                            <div>
                                <IconButton
                                    variant = "outlined" 
                                    color="primary"
                                    onClick={()=> this.handleEditName()}
                                >
                                    <CheckIcon/>
                                </IconButton>
                                <IconButton
                                    variant = "outlined" 
                                    color="primary"
                                    onClick={()=> this.setState({indexName : !this.state.indexName})}
                                >
                                    <ClearIcon/>
                                </IconButton>
                            </div>
                            :
                                <Button 
                                variant = "outlined" 
                                color="primary"
                                onClick={()=>this.setState({indexName : !this.state.indexName, indexEmail: false, indexPassword: false})}
                            >
                                Edit
                            </Button>}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>
                            {indexEmail ? 
                            <FormControl variant="outlined" style={styles.regInput}>
                                <OutlinedInput 
                                    id="outlined-adornment-weight"
                                    placeholder='Email'
                                    error = {errorEmail}
                                    placeholder={this.props.email}
                                    defaultValue={this.props.email}
                                    inputRef={(email) => this.email = email}
                                    onChange = {(e) => this.handleEmail(e)}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                    'aria-label': 'weight'
                                    }}
                                />
                                <FormHelperText 
                                    id="outlined-weight-helper-text"
                                    style={errorEmail? styles.error: styles.default}>
                                        {errorTextEmail}
                                </FormHelperText>
                            </FormControl>

                            :
                            this.props.email}
                        </TableCell>
                        <TableCell>
                            {indexEmail ?
                            <div>
                                <IconButton
                                    variant = "outlined" 
                                    color="primary"
                                    onClick={()=> this.handleEditEmail()}
                                >
                                    <CheckIcon/>
                                </IconButton>
                                <IconButton
                                    variant = "outlined" 
                                    color="primary"
                                    onClick={()=> this.setState({indexEmail : !indexEmail})}
                                >
                                    <ClearIcon/>
                                </IconButton>
                            </div>
                            :
                                <Button 
                                    variant = "outlined" 
                                    color="primary"
                                    onClick={()=>this.setState({indexEmail : !indexEmail, indexName : false, indexPassword: false})}
                                >
                                Edit
                            </Button>}
                        </TableCell>
                    </TableRow>
                    {indexPassword ?
                    <>
                    <TableRow>
                        <TableCell>Current Password</TableCell>
                        <TableCell>
                            <FormControl variant="outlined" style={styles.regInput}>
                                <OutlinedInput 
                                    id="outlined-adornment-weight"
                                    placeholder='Confirm Password'
                                    error = {errorCurrentPass}
                                    inputRef={(currentPassword) => this.currentPassword = currentPassword}
                                    onChange = {(e) => this.handleCurrentPass(e)}
                                    type = {showPassword? 'text' : 'password'}
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
                                    style={errorCurrentPass? styles.error: styles.default}>
                                        {errorTextCurrentPass}
                                </FormHelperText>
                            </FormControl>
                        </TableCell>
                        <TableCell>
                            <IconButton
                                variant = "outlined" 
                                color="primary"
                                onClick={()=> this.handleEditPass()}
                            >
                                <CheckIcon/>
                            </IconButton>
                            <IconButton
                                variant = "outlined" 
                                color="primary"
                                onClick={()=>this.setState({indexPassword : !this.state.indexPassword})}
                            >
                                <ClearIcon/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>New Password</TableCell>
                        <TableCell colSpan={1}>
                            <FormControl variant="outlined" style={styles.regInput}>
                                <OutlinedInput 
                                    id="outlined-adornment-weight"
                                    placeholder='Password'
                                    error = {errorPass}
                                    inputRef={(password) => this.password = password}
                                    onChange = {(e) => this.handlePass(e)}
                                    type = {showPassword? 'text' : 'password'}
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
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Confirm Password</TableCell>
                        <TableCell>
                            <FormControl variant="outlined" style={styles.regInput}>
                                <OutlinedInput 
                                    id="outlined-adornment-weight"
                                    placeholder='Confirm Password'
                                    error = {errorConfPass}
                                    inputRef={(confirmPassword) => this.confirmPassword = confirmPassword}
                                    onChange = {(e) => this.handleConfPass(e)}
                                    type = {showPassword? 'text' : 'password'}
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
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    </>
                        :
                    <TableRow>
                        <TableCell colSpan={2}>Password</TableCell>
                        <TableCell>
                            <Button 
                                variant = "outlined" 
                                color="primary"
                                onClick={()=>this.setState({indexPassword : !indexPassword, indexEmail : false, indexName : false})}>
                                Edit
                            </Button>
                        </TableCell>
                    </TableRow>
                        }
                </Table>
            )
    }
    
    handleClose = () => {
        this.setState({alert : false})
    }

    render() {
        const {users, alert} = this.state

        console.log(this.props.id)
        console.log(users)
        // console.log(users[0].password)
        

        return(
            <div style={styles.root}>
                <NavbarMaterial/>
                <div style={styles.container}>
                    <Paper style={styles.profile} elevation={6}>
                        <h1 style={styles.title}>Profile</h1>
                        {this.renderTable()}
                        <Dialog
                            open={alert}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-slide-title"
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogTitle id="alert-dialog-slide-title">{"⚠ Warning !"}</DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Your input is wrong. Please try again!
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Ok
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </Paper>
                </div>
                <Footer/>
            </div>
        )
    }
}

const styles= { 
    root: {
        minHeight : '100vh',
        backgroundColor : '#f2f2f2',
        paddingTop : '90px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    container:{
        width: '100%',
        height: '90vh',
        display: 'flex',
        justifyContent:'center'
    },
    title:{
        textAlign: 'center'
    },
    profile:{
        width: '35%',
        margin: '30px 0',
        backgroundColor: 'white',
        display:'flex',
        flexDirection: 'column',
    },
    table:{
        textAlign: 'center'
    },
    regInput:{
        width:'70%',
    },
}

const mapStateToProps = (state) =>{
    return{
        id: state.user.id,
        username: state.user.username,
        email : state.user.email
    }
}

export default connect(mapStateToProps, {LogIn})(ProfileUser)