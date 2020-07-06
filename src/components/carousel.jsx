import React from "react";
import Slider from "react-slick";
import { IconButton, Button } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import StorefrontIcon from '@material-ui/icons/Storefront';

const settings = {
  dots: true,
  infinite: true,
  speed: 2000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay : true,
  autoplaySpeed : 3000,
  cssEase : "ease",
  // fade : true,
  appendDots : dots => {
      return (
          <div style={styles.dots}>
              <ul>{dots}</ul>
          </div>
      )
  },
  nextArrow : <NextArrow/>,
  prevArrow : <PrevArrow/>
}

const CarouselBar = (props) => {
    return (
      <div style={styles.root}>
        <Slider {...settings} style={styles.slider}>
            { props.dataSlider !== null ?
            props.dataSlider.map((item,index) => {
              return (
                <div key={index}>
                  <div style={{
                      backgroundImage : `url(${item.images})`,
                      ...styles.content
                  }}>
                    <h1 style={styles.title}>{item.title}</h1>
                    <Button startIcon={<StorefrontIcon/>} style={styles.button}>Shop Now</Button>
                  </div>
                </div>
                )
              }) :
              null
              }
        </Slider>
      </div>
    );
}

const styles = {
  root : {
      width : '100%',
      height : '100vh',
  },
  slider : {
      height : '100%',
      width : '100%',
      backgroundColor : 'white',
      position : 'relative'
  },
  next : {
      position : 'absolute',
      right : '7%',
      top : '45%',
      zIndex : 3,
      backgroundColor : 'rgba(255, 255, 255, 0.4)'
  },
  prev : {
      position : 'absolute',
      left : '7%',
      top : '45%',
      zIndex : 3,
      backgroundColor : 'rgba(255, 255, 255, 0.4)'
  },
  dots : {
      position : 'absolute',
      bottom : 0,
      zIndex : 2,
      height : 30
  },
  content : {
      backgroundRepeat : 'no-repeat',
      backgroundSize : 'cover',
      height : '100vh',
      width : '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '4% 0px'
  },
  title : {
    fontSize: 64,
    color: 'white',
    textTransform: 'capitalize',
    marginBottom: 20
  },
  button: {
    backgroundColor: 'white',
    padding: '10px 20px'
  }
}

function NextArrow (props) {
  const { onClick } = props
  return (
      <IconButton style={styles.next} onClick={onClick}>
          <NavigateNextIcon/>
      </IconButton>
  )
}

function PrevArrow (props) {
  const { onClick } = props
  return (
      <IconButton style={styles.prev} onClick={onClick}>
          <NavigateBeforeIcon/>
      </IconButton>
  )
}

export default CarouselBar