import React from 'react'
import FacebookIcon from '@material-ui/icons/Facebook';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';


const Footer = () => {
    return (
    <div style={styles.root}>
        <h1 style={styles.copyright}>Copyright 2020 &copy; Fesyah</h1>
        <ul style={styles.ul}>
            <li style={styles.li}><FacebookIcon/></li>
            <li style={styles.li}><InstagramIcon/></li>
            <li style={styles.li}><TwitterIcon/></li>
            <li style={styles.li}><GitHubIcon/></li>
        </ul>
    </div>
    )
}

const styles = {
    root: {
        height : 70,
        width : '100%',
        backgroundColor : '#130f40',
        padding : '2% 7%',
        display : 'flex',
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    copyright : {
        fontSize : 16,
        color : 'white'
    },
    ul : {
        textDecoration : 'none'
    },
    li : {
        display : 'inline-block',
        color : 'white',
        marginLeft : 15,
        cursor : 'pointer'
    }
}

export default Footer