import React from 'react';
import axios from 'axios';
import {AuthContext} from './contexts/AuthContext';

class VVIR extends React.Component {
    static contextType = AuthContext;
    //constructor -  intialize parameters for pacing mode
    constructor(props) {
      super(props);
      this.state = {
        error_lower:"",
        error_upper:"",
        error_ventricular_amp:"",
        error_ventricular_pw:"",
        error_maximum_sensor_rate:"",
        error_vrp:"",
        communication: false,
        lower:"", 
        upper:"", 
        maximum_sensor_rate:"", 
        ventricular_amp:"", 
        ventricular_pw:"",
        vrp:""
      };
    }

    //this function is called when VVIR mode becomes active - sends a request to the backend to save programmable parameters for current user
    componentDidMount(){
      console.log(this.context)
      axios.post('http://localhost:3000/getConfig',  {
        username: this.context.username
        })
        .then( res =>{
          this.setState({
            lower: res.data.config.VVIR.lower,
            upper: res.data.config.VVIR.upper,
            ventricular_amp: res.data.config.VVIR.ventricular_amp,
            ventricular_pw: res.data.config.VVIR.ventricular_pw,
            maximum_sensor_rate: res.data.config.VVIR.maximum_sensor_rate,
            vrp: res.data.config.VVIR.vrp
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
      let ventricular_amp = Number(document.getElementById('ventricular-amp').value);
      let ventricular_pw = Number(document.getElementById('ventricular-pw').value);
      let maximum_sensor_rate = Number(document.getElementById('maximum-sensor-rate').value);
      let vrp = Number(document.getElementById('vrp').value);

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


      if(vrp > 500 || vrp < 150 || !vrp){
        this.setState({error_vrp: "Make sure: value is between 150ms and 500ms"});
        error = true;
      }
      else{
        this.setState({error_vrp: ""});
      }

      if(maximum_sensor_rate < 50 || maximum_sensor_rate > 175|| !maximum_sensor_rate){
        this.setState({error_maximum_sensor_rate: "Make sure: value is between 50ppm and 175ppm"});
        error = true;
      }
      else{
        this.setState({error_maximum_sensor_rate:""});
      }

      //if all inputs are valid, proceed by making sending parameters to backend to be serially communicated
      if(!error){
        //all errors clean
        //then do submit action
        axios.post('http://localhost:3000/pace',  {
          username: this.context.username,
          mode: 'VVIR',
          config: {lower, upper, ventricular_amp, ventricular_pw, vrp, maximum_sensor_rate}
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
              <label>Maximum Sensor Rate</label>
              {this.state.error_maximum_sensor_rate === "" ? <div></div> :  <div className="error-message">{this.state.error_maximum_sensor_rate}</div>}
              <input
                type="text"
                name="maximum-sensor-rate"
                id="maximum-sensor-rate"
                value={this.state.maximum_sensor_rate}
                onChange={(event)=>{this.setState({maximum_sensor_rate: event.target.value})}}
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
              <label>VRP</label>
              {this.state.error_vrp === "" ? <div></div> :  <div className="error-message">{this.state.error_vrp}</div>}
              <input
                type="text"
                name="vrp"
                id="vrp"
                value={this.state.vrp}
                onChange={(event)=>{this.setState({vrp: event.target.value})}}
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

  export default VVIR;