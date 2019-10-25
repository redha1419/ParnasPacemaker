import React from 'react';
import axios from 'axios';
import {AuthContext} from './contexts/AuthContext';

class SignIn extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: false
    };
  }

  componentDidMount(){
    this.context.unAuthenticate();
  }

  submitLogin(e) {
      //ask backend, give credentials
      //if success route to next page
      //else display text
      
      
      let username = document.getElementById('username').value;
      let password = document.getElementById('password').value;
      axios.post('http://localhost:3000/login',  {
        username,
        password
        })
        .then( res =>{
          console.log(res.data)
          if(res.data.auth === true){
            this.context.authenticate();
            this.props.history.push('/pacing-interface/AOO');
          } else{
            this.context.unAuthenticate();
          }
        })
        .catch(err =>{
          console.log(err);
          this.setState({error: true})
      }) 


      
  }

  render() {
    return (
      <div className="box-container">
        <div className="inner-container">
          <div className="header">
            Login
          </div>
          {this.state.error ? <div className="error-message">Incorrect username/password</div> : <div></div>}
          <div className="box">

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="login-input"
                placeholder="Username"/>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="login-input"
                placeholder="Password"/>
            </div>

            <button
              type="button"
              className="login-btn"
              onClick={this.submitLogin.bind(this)}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

}

export default SignIn;
