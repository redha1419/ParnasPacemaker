import React from 'react';
import './App.css';
import {Link} from 'react-router-dom';

//This component is responsible for the tab buttons used for switching between the Sign-in and Sign-up pages
class Controller extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: true,
      isRegisterOpen: false
    };
  }

  //if sign-in tab is active, show sign-in screen
  showLoginBox() {
    this.setState({isLoginOpen: true, isRegisterOpen: false});

  }

  //if sign-up tab is active, show sign-up screen
  showRegisterBox() {
    this.setState({isRegisterOpen: true, isLoginOpen: false});
  }

  render() {

    return (

        <div className="box-controller">
          <Link to="/home/login"
            className={"controller " + (this.state.isLoginOpen
            ? "selected-controller"
            : "")}
            onClick={this
            .showLoginBox
            .bind(this)}>
            Login
          </Link>
          <Link to="/home/register"
            className={"controller " + (this.state.isRegisterOpen
            ? "selected-controller"
            : "")}
            onClick={this
            .showRegisterBox
            .bind(this)}>
            Register
          </Link>
        </div>
    );
  }

}

export default Controller;

/* function App() {
  return (
    <div className="">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App; */
