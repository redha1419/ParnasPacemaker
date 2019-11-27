import React from 'react';
import axios from 'axios';
import {AuthContext} from './contexts/AuthContext';

class DOO extends React.Component {
    static contextType = AuthContext;
    //constructor -  intialize parameters for pacing mode
    constructor(props) {
      super(props);
      this.state = {
        error_lower:"",
        error_upper:"",
        error_fixed_av_delay:"",
        error_atrial_amp:"",
        error_atrial_pw:"",
        error_ventricular_amp:"",
        error_ventricular_pw:"",
        communication: false,
        lower:"", 
        upper:"", 
        fixed_av_delay:"", 
        atrial_amp:"", 
        atrial_pw:"",
        ventricular_amp:"", 
        ventricular_pw:""
      };
    }

    //this function is called when DOO mode becomes active - sends a request to the backend to save programmable parameters for current user
    componentDidMount(){
      console.log(this.context)
      axios.post('http://localhost:3000/getConfig',  {
        username: this.context.username
        })
        .then( res =>{
          this.setState({
            lower: res.data.config.DOO.lower,
            upper: res.data.config.DOO.upper,
            fixed_av_delay: res.data.config.DOO.fixed_av_delay,
            atrial_amp: res.data.config.DOO.atrial_amp,
            atrial_pw: res.data.config.DOO.atrial_pw,
            ventricular_amp: res.data.config.DOO.ventricular_amp,
            ventricular_pw: res.data.config.DOO.ventricular_pw,
          });
        })
        .catch(err =>{
          console.log(err)
      }) 
    }

    //called when 'Start!' button is clicked
    submit(e){
      //first check all values

      let lower = Number(document.getElementById('lower').value);
      let upper = Number(document.getElementById('upper').value);
      let fixed_av_delay = Number(document.getElementById('fixed-av-delay').value); 
      let atrial_amp = Number(document.getElementById('atrial-amp').value); 
      let atrial_pw = Number(document.getElementById('atrial-pw').value);
      let ventricular_amp = Number(document.getElementById('ventricular-amp').value);
      let ventricular_pw = Number(document.getElementById('ventricular-pw').value);

      let error = false;

      //check for invalid inputs
      if(lower < 30 || upper < lower || !lower){
        this.setState({error_lower: "Make sure: value is less than upper limit and greater than 30"});
        error = true;
      }
      else{
        this.setState({error_lower: ""});
      }

      if(upper > 225 || upper < lower || !upper){
        this.setState({error_upper: "Make sure: value is greater than upper limit and less than 225"});
        error = true;
      }
      else{
        this.setState({error_upper: ""});
      }

      if(ventricular_amp > 7 || ventricular_amp < 0 || !ventricular_amp){
        this.setState({error_ventricular_amp: "Make sure: value is between 0V and 7V"});
        error = true;
      }
      else{
        this.setState({error_ventricular_amp: ""});
      }

      if(ventricular_pw > 2 || ventricular_pw < 0 || !ventricular_pw){
        this.setState({error_ventricular_pw: "Make sure: value is between 0V and 2ms"});
        error = true;
      }
      else{
        this.setState({error_ventricular_pw: ""});
      }

      console.log(fixed_av_delay)

      if(fixed_av_delay < 70 || fixed_av_delay > 300 || !fixed_av_delay){
        this.setState({error_fixed_av_delay: "Make sure: value is between 70ms and 300ms"});
        error = true;
      }
      else{
        this.setState({error_fixed_av_delay: ""});
      }

      if(atrial_amp > 7 || atrial_amp < 0 || !atrial_amp){
        this.setState({error_atrial_amp: "Make sure: value is between 0V and 7V"});
        error = true;
      }
      else{
        this.setState({error_atrial_amp: ""});
      }

      if(atrial_pw > 2 || atrial_pw < 0 || !atrial_pw){
        this.setState({error_atrial_pw: "Make sure: value is between 0V and 2ms"});
        error = true;
      }
      else{
        this.setState({error_atrial_pw: ""});
      }

      //if all inputs are valid, proceed by making sending parameters to backend to be serially communicated
      if(!error){
        //all errors clean
        //then do submit action
        axios.post('http://localhost:3000/pace',  {
          username: this.context.username,
          mode: 'DOO',
          config: {lower, upper, ventricular_amp, ventricular_pw, fixed_av_delay, atrial_amp, atrial_pw}
          })
          .then( res =>{
            this.setState({communication: true});
          })
          .catch(err =>{
            this.setState({communication: false});
        }) 
      }
      else{
        this.setState({communication: false});
      }

    }
    
    render() {
      return (
          <div className="box">
            {this.state.communication ? <div className="success-message">Succesfully sent configuaration</div> : <div></div>}
            <div className="input-group2">
              <label>Lower Rate Limit</label>
              {this.state.error_lower === "" ?  <div></div> : <div className="error-message">{this.state.error_lower}</div> }
              <input
                type="text"
                name="lower"
                id="lower"
                value={this.state.lower}
                onChange={(event)=>{this.setState({lower: event.target.value})}}
                className="login-input"/>
            </div>
  
            <div className="input-group2">
              <label>Upper Rate Limit</label>
              {this.state.error_upper === "" ? <div></div> : <div className="error-message">{this.state.error_upper}</div>}
              <input
                type="text"
                name="upper"
                id="upper"
                value={this.state.upper}
                onChange={(event)=>{this.setState({upper: event.target.value})}}
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Ventricular Amplitude</label>
              {this.state.error_ventricular_amp === "" ? <div></div> : <div className="error-message">{this.state.error_ventricular_amp}</div>}
              <input
                type="text"
                name="ventricular-amp"
                id="ventricular-amp"
                value={this.state.ventricular_amp}
                onChange={(event)=>{this.setState({ventricular_amp: event.target.value})}}
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Ventricular Pulse Width</label>
              {this.state.error_ventricular_pw === "" ? <div></div> :  <div className="error-message">{this.state.error_ventricular_pw}</div>}
              <input
                type="text"
                name="ventricular-pw"
                id="ventricular-pw"
                value={this.state.ventricular_pw}
                onChange={(event)=>{this.setState({ventricular_pw: event.target.value})}}
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Fixed Av Delay</label>
              {this.state.error_fixed_av_delay === "" ? <div></div> :  <div className="error-message">{this.state.error_fixed_av_delay}</div>}
              <input
                type="text"
                name="fixed-av-delay"
                id="fixed-av-delay"
                value={this.state.fixed_av_delay}
                onChange={(event)=>{this.setState({fixed_av_delay: event.target.value})}}
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Atrial Amplitude</label>
              {this.state.error_atrial_amp === "" ? <div></div> : <div className="error-message">{this.state.error_atrial_amp}</div>}
              <input
                type="text"
                name="atrial-amp"
                id="atrial-amp"
                value={this.state.atrial_amp}
                onChange={(event)=>{this.setState({atrial_amp: event.target.value})}}
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Atrial Pulse Width</label>
              {this.state.error_atrial_pw === "" ? <div></div> : <div className="error-message">{this.state.error_atrial_pw}</div>}
              <input
                type="text"
                name="atrial-pw"
                id="atrial-pw"
                value={this.state.atrial_pw || ''}
                onChange={(event)=>{this.setState({atrial_pw: event.target.value})}}
                className="login-input"/>
            </div>
  
            <button
              type="button"
              className="login-btn"
              onClick={this.submit.bind(this)}
              >
                Start!
            </button>
          </div>
      );
    }
  
  }

  export default DOO;