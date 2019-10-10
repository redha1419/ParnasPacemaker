import React from 'react';
import PacingInterface from './PacingInterface';

class SignIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };

  }

  submitLogin(e) {
      //ask backend, give credentials
      //if success route to next page
      //else display text
      this.setState({
        isLogin: true
      });
  }



  render() {

    return (
      <div className="inner-container">
       {this.state.isLogin && <PacingInterface/>}
        <div className="header">
          Login
        </div>
        <div className="box">

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              className="login-input"
              placeholder="Username"/>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              className="login-input"
              placeholder="Password"/>
          </div>

          <button
            type="button"
            className="login-btn"
            onClick={this
            .submitLogin
            .bind(this)}>Login</button>
        </div>
      </div>
    );
  }

}

export default SignIn;