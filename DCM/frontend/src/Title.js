import React from 'react';
import './App.css';
import SignIn from './SignIn.js';
import SignUp from './SignUp';
import logo from './pacemaker_logo.png';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import PacingInterface from './PacingInterface';
import Controller from './Controller';

function Title () {

    return (
        <Link to="/home/login" className="title-container title">
          <img src={logo} alt="logo"/>
          <h1>Welcome to ParnasPacemaker!</h1>
        </Link>
    );

}

export default Title;