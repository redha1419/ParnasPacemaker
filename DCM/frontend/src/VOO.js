import React from 'react';
import axios from 'axios';
import {AuthContext} from './contexts/AuthContext';
import Checkbox from '@material-ui/core/Checkbox';

class VOO extends React.Component {
    static contextType = AuthContext;
    //constructor -  intialize parameters for pacing mode
    constructor(props) {
      super(props);
      this.state = {
        error_lower:"",
        error_upper:"",
        error_ventricular_amp:"",
        error_ventricular_pw:"",
        //rate adaptive error checking
        error_maximum_sensor_rate:"",
        error_activity_threshold:"", 
        error_reaction_time: "", 
        error_response_factor: "",
        error_recovery_time: "",
        communication: false,
        lower:"", 
        upper:"", 
        ventricular_amp:"", 
        ventricular_pw:"",
        //rate adaptive parameters 
        maximum_sensor_rate:"",
        activity_threshold:"", 
        reaction_time:"", 
        response_factor: "", 
        recovery_time:"", 
        checked: false
      };
    }

    //this function is called when VOO mode becomes active - sends a request to the backend to save programmable parameters for current user
    componentDidMount(){
      console.log(this.context)
      axios.post('http://localhost:3000/getConfig',  {
        username: this.context.username
        })
        .then( res =>{  //successful request to backend - set parameters
          this.setState({
            lower: res.data.config.VOO.lower,
            upper: res.data.config.VOO.upper,
            ventricular_amp: res.data.config.VOO.ventricular_amp,
            ventricular_pw: res.data.config.VOO.ventricular_pw,
            //rate adaptive
            maximum_sensor_rate: res.data.config.VOO.maximum_sensor_rate,
            activity_threshold: res.data.config.VOO.activity_threshold,
            reaction_time: res.data.config.VOO.reaction_time, 
            response_factor: res.data.config.VOO.response_factor,
            recovery_time: res.data.config.VOO.recovery_time
          });
        })
        .catch(err =>{    //otherwise print error
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
      //rate adaptive
      let maximum_sensor_rate = !this.state.checked ? "":Number(document.getElementById('maximum-sensor-rate').value); 
      let activity_threshold =!this.state.checked ? "":Number(document.getElementById('activity-threshold').value); 
      let reaction_time = !this.state.checked ? "":Number(document.getElementById('reaction-time').value); 
      let response_factor = !this.state.checked ? "":Number(document.getElementById('response-factor').value); 
      let recovery_time =!this.state.checked ? "" :Number(document.getElementById('recovery-time').value); 

      let mode = 'VOO';

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

      if(ventricular_amp > 7 || ventricular_amp < 0 || !ventricular_amp ){
        this.setState({error_ventricular_amp: "Make sure: value is between 0V and 7V"});
        error = true;
      }
      else{
        this.setState({error_ventricular_amp: ""});
      }

      if(ventricular_pw > 5 || ventricular_pw < 0 ||  !ventricular_amp){
        this.setState({error_ventricular_pw: "Make sure: value is between 0ms and 5ms"});
        error = true;
      }
      else{
        this.setState({error_ventricular_pw: ""});
      }

      //rate adaptive modes error checking
      if(this.state.checked)
      {
        mode = 'VOOR';
        if((maximum_sensor_rate < 50 || maximum_sensor_rate > 175|| !maximum_sensor_rate)){
          this.setState({error_maximum_sensor_rate: "Make sure: value is between 50ppm and 175ppm"});
          error = true;
        }
        else{
          this.setState({error_maximum_sensor_rate:""});
        }

        if(( activity_threshold< 0 || activity_threshold > 10|| !activity_threshold)){
          this.setState({error_activity_threshold: "Make sure: value is between 0 and 10"});
          error = true;
        }
        else{
          this.setState({error_activity_threshold:""});
        }

        if(( reaction_time < 10 || reaction_time > 50|| !reaction_time)){
          this.setState({error_reaction_time: "Make sure: value is between 10s and 50s"});
          error = true;
        }
        else{
          this.setState({error_reaction_time:""});
        }

        if(( response_factor< 1 || response_factor > 16|| !response_factor)){
          this.setState({error_response_factor: "Make sure: value is between 1 and 16"});
          error = true;
        }
        else{
          this.setState({error_response_factor:""});
        }

        if(( recovery_time< 2 || recovery_time > 16|| !recovery_time)){
          this.setState({error_recovery_time: "Make sure: value is between 2 and 16"});
          error = true;
        }
        else{
          this.setState({error_recovery_time:""});
        }

      }

      //if all inputs are valid, proceed by making sending parameters to backend to be serially communicated
      if(!error){
        //all errors clean
        //then do submit action
        axios.post('http://localhost:3000/pace',  {
          username: this.context.username,
          mode: mode,
          config: {lower, upper, ventricular_amp, ventricular_pw,maximum_sensor_rate,activity_threshold,reaction_time,recovery_time,response_factor}
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

    handleChange(event){
      this.setState({checked: !this.state.checked });
    };
    
    render() {
      return (
          <div className="box">
            {this.state.communication ? <div className="success-message">Succesfully sent configuaration</div> : <div></div>}
            <div>
            Rate Adaptive
            <Checkbox
              checked={this.state.checked}
              onChange={this.handleChange.bind(this)}
              value="checkedA"
              inputProps={{
                'aria-label': 'primary checkbox',
              }}
            />
            </div>
            
            <div className="input-group2">
              <label>Lower Rate Limit</label>
              {this.state.error_lower === "" ?  <div></div> : <div className="error-message">{this.state.error_lower}</div> }
              <input
                type="text"
                name="lower"
                id="lower"
                value={this.state.lower || ''}
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
                value={this.state.upper || ''}
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
                value={this.state.ventricular_amp || ''}
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
                value={this.state.ventricular_pw || ''}
                onChange={(event)=>{this.setState({ventricular_pw: event.target.value})}}
                className="login-input"/>
            </div>

            {
              this.state.checked ?
              <div>
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
            <label>Activity Threshold</label>
            {this.state.error_activity_threshold === "" ? <div></div> :  <div className="error-message">{this.state.error_activity_threshold}</div>}
            <input
              type="text"
              name="activity-threshold"
              id="activity-threshold"
              value={this.state.activity_threshold}
              onChange={(event)=>{this.setState({activity_threshold: event.target.value})}}
              className="login-input"/>
          </div>

          <div className="input-group2">
            <label>Reaction Time</label>
            {this.state.error_reaction_time === "" ? <div></div> :  <div className="error-message">{this.state.error_reaction_time}</div>}
            <input
              type="text"
              name="reaction-time"
              id="reaction-time"
              value={this.state.reaction_time}
              onChange={(event)=>{this.setState({reaction_time: event.target.value})}}
              className="login-input"/>
          </div>

          <div className="input-group2">
            <label>Response Factor</label>
            {this.state.error_response_factor === "" ? <div></div> :  <div className="error-message">{this.state.error_response_factor}</div>}
            <input
              type="text"
              name="response-factor"
              id="response-factor"
              value={this.state.response_factor}
              onChange={(event)=>{this.setState({response_factor: event.target.value})}}
              className="login-input"/>
          </div>

          <div className="input-group2">
            <label>Recovery Time</label>
            {this.state.error_recovery_time === "" ? <div></div> :  <div className="error-message">{this.state.error_recovery_time}</div>}
            <input
              type="text"
              name="recovery-time"
              id="recovery-time"
              value={this.state.recovery_time}
              onChange={(event)=>{this.setState({recovery_time: event.target.value})}}
              className="login-input"/>
          </div>

          </div>
            
              : null
            }

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

  export default VOO;