import React from 'react';
import './App.css';
import SignIn from './SignIn.js';
import SignUp from './SignUp';
import {BrowserRouter, Route} from 'react-router-dom';
import PacingInterface from './PacingInterface';
import Electrogram from './Electrogram';
import Controller from './Controller';
import Title from './Title';
import AuthContextProvider from './contexts/AuthContext';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  //intialize paths for each page
  render() {

    return (
      <BrowserRouter>
        <div className="root-container">
          <AuthContextProvider>
            <Route path="/" exact component={Title} />
            <Route path="/home" component={Controller} />
            <Route path="/home/login" exact component={SignIn} />
            <Route path="/home/register" exact component={SignUp} />
            <Route path="/pacing-interface" component={PacingInterface} />
            <Route path="/electrogram" component={Electrogram} />
          </AuthContextProvider>
        </div>
      </BrowserRouter>
      

    );
  }

}

export default App;

