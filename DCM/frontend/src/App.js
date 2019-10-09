import React from 'react';
import './App.css';
import SignIn from './SignIn.js';
import SignUp from './SignUp';
import logo from './pacemaker_logo.png';

class App extends React.Component {

  showLoginBox() {
    this.setState({isLoginOpen: true, isRegisterOpen: false});
  }

  showRegisterBox() {
    this.setState({isRegisterOpen: true, isLoginOpen: false});
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: true,
      isRegisterOpen: false
    };
  }

  render() {

    return (
      <div className="root-container">

        <div className="title-container">
          <img src={logo} alt="logo"/>
          <h1>Welcome to ParnasPacemaker!</h1>
        </div>
        
        <div className="box-container">
          {this.state.isLoginOpen && <SignIn/>}
          {this.state.isRegisterOpen && <SignUp/>}
        </div>

        <div className="box-controller">
          <div
            className={"controller " + (this.state.isLoginOpen
            ? "selected-controller"
            : "")}
            onClick={this
            .showLoginBox
            .bind(this)}>
            Login
          </div>
          <div
            className={"controller " + (this.state.isRegisterOpen
            ? "selected-controller"
            : "")}
            onClick={this
            .showRegisterBox
            .bind(this)}>
            Register
          </div>
        </div>

      </div>

    );
  }

}

export default App;

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
