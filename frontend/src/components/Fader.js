import React, { useState, useEffect } from 'react'
import {Image,Container} from 'react-bootstrap';
import { CHAT_ROUTE} from '../utils/consts';
import PropTypes from 'prop-types'
import '../App.css'
import { Link } from 'react-router-dom';

const Fader = ({ time, src }) => {

    const [fadeProp, setFadeProp] = useState({
        fade: 'fade-out',
    });

    useEffect(() => {
        const timeout = setInterval(() => {
                setFadeProp({
                    fade: 'fade-in'
                })
        }, 1000);

        return () => clearInterval(timeout)
    }, [fadeProp])

    return (
       <Container style={{marginBottom:100}} className="d-flex flex-column align-items-center">
            <Image style={{width:'60vh',height:'60vh'}} className={fadeProp.fade} src={src}></Image>
            <Link to={CHAT_ROUTE}>
            <button style={{ width:'30vh',fontSize:'120%' ,backgroundColor:'RoyalBlue'
            ,borderColor:'RoyalBlue',color:'white',borderRadius:10}} className={fadeProp.fade}>Начать</button>
            </Link>
        </Container>
    )
}

Fader.defaultProps = {
    src:''
}

Fader.propTypes = {
    text: PropTypes.string,
}

export default Fader