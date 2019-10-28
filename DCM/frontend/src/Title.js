import React from 'react';
import './App.css';
import logo from './pacemaker_logo.png';
import {Link} from 'react-router-dom';

//displays welcome page and allows user to click on text or logo to be redirected to sign-in page
function Title () {

    return (
        <Link to="/home/login" className="title-container title">
          <img src={logo} alt="logo"/>
          <h1>Welcome to ParnasPacemaker!</h1>
        </Link>
    );

}

export default Title;