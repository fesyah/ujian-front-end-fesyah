import React from 'react'
import Axios from 'axios'

// import components
import CarouselBar from '../components/carousel'
import Products from '../components/products';
import NavbarMaterial from '../components/navbar';
import Footer from '../components/footer'

import { connect } from 'react-redux'
import { getSlider } from '../actions'

const URL = 'http://localhost:2000/'

class HomePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          slider: [], products: []
        };
      }

    componentDidMount(){
        this.getData('products')
        this.getData('slider')
        this.getData('users')
    }
    
    getData = (query) =>{
        Axios.get(URL + query)
        .then((response) => {
            if(query === 'slider'){
                // this.setState({slider: response.data})
                this.props.getSlider(response.data)
                console.log(response.data)
            } else if(query === 'products'){
                this.setState({products: response.data})
                console.log(response.data)
            } else {
                this.setState({users: response.data})
                console.log(response.data)
            }
    })

    .catch(error => console.log(error))
    }
    render(){
        console.log(this.state.slider)
        console.log(this.state.products)
        return(
            <div>
                <NavbarMaterial/>
                <CarouselBar dataSlider ={this.props.slide} />
                <Products dataProducts = {this.state.products}/>
                <Footer/>
            </div>
        )
    }
}


const mapToProps = (state) => {
    console.log("MapToprops", state.sliderReducer)
    return {
        slide: state.sliderReducer
    }
}

export default connect(mapToProps, { getSlider })(HomePage);
