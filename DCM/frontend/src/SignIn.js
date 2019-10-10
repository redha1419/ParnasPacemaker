import React from 'react';

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
      this.props.history.push('/pacing-interface/AOO');
  }

  render() {

    return (
      <div className="box-container">
        <div className="inner-container">
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
      </div>
    );
  }

}

export default SignIn;