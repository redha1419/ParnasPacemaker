import React from 'react';
import axios from 'axios';
import {AuthContext} from './contexts/AuthContext';

class AAIR extends React.Component {
    static contextType = AuthContext;
    //constructor -  intialize parameters for pacing mode
    constructor(props) {
      super(props);
      this.state = {
        error_lower:"",
        error_upper:"",
        error_atrial_amp:"",
        error_atrial_pw:"",
        error_arp: "",
        error_maximum_sensor_rate: "",
        communication: false,
        lower:"", 
        upper:"", 
        maximum_sensor_rate: "",
        atrial_amp:"", 
        atrial_pw:"",
        arp:""
      };
    }

    //this function is called when AAIR mode becomes active - sends a request to the backend to save programmable parameters for current user
    componentDidMount(){
      console.log(this.context)
      axios.post('http://localhost:3000/getConfig',  {
        username: this.context.username
        })
        .then( res =>{      //successful request to backend - set parameters
          this.setState({
            lower: res.data.config.AAIR.lower,
            upper: res.data.config.AAIR.upper,
            atrial_amp: res.data.config.AAIR.atrial_amp,
            atrial_pw: res.data.config.AAIR.atrial_pw,
            arp: res.data.config.AAIR.arp,
            maximum_sensor_rate: res.data.config.AAIR.maximum_sensor_rate
          });
        })
        .catch(err =>{    //otherwise print error
          console.log(err)
      }) 
    }

    //called when 'Start!' button is clicked
    submit(e){
      //first check all vals
      let lower = Number(document.getElementById('lower').value);
      let upper = Number(document.getElementById('upper').value);
      let atrial_amp = Number(document.getElementById('atrial-amp').value);
      let atrial_pw = Number(document.getElementById('atrial-pw').value);
      let arp = Number(document.getElementById('arp').value);
      let maximum_sensor_rate = Number(document.getElementById('maximum-sensor-rate'))

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

      if(arp < 150 || arp > 500 || !arp){
        this.setState({error_arp: "Make sure: value is between 150ms and 500ms"});
        error = true;
      }
      else{
        this.setState({error_arp: ""});
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
          mode: 'AAIR',
          config: {lower, upper, atrial_amp, atrial_pw, arp, maximum_sensor_rate}
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
              {this.state.error_lower === "" ? <div></div> : <div className="error-message">{this.state.error_lower}</div>}
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
              {this.state.error_upper === "" ?  <div></div> : <div className="error-message">{this.state.error_upper}</div>}
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

            <div className="input-group2">
              <label>ARP</label>
              {this.state.error_arp === "" ? <div></div> : <div className="error-message">{this.state.error_arp}</div>}
              <input
                type="text"
                name="arp"
                id="arp"
                value={this.state.arp}
                onChange={(event)=>{this.setState({arp: event.target.value})}}
                className="login-input"/>
            </div>
  
            <button
              type="button"
              onClick={this.submit.bind(this)}
              className="login-btn">Start!</button>
          </div>
      );
    }
  
  }

  export default AAIR;