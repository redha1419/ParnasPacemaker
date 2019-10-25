import React from 'react';

class AAI extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        error_lower:"",
        error_upper:"",
        error_atrial_amp:"",
        error_atrial_pw:"",
        error_arp: "",
        communication: false
      };
    }

    submit(e){
      //first check all vals
      let lower = document.getElementById('lower').value;
      let upper = document.getElementById('upper').value;
      let atrial_amp = document.getElementById('atrial-amp').value;
      let atrial_pw = document.getElementById('atrial-pw').value;
      let arp = document.getElementById('arp').value;

      console.log(lower)
      console.log(upper)
      console.log(upper > lower)

      if(lower < 30 || upper < lower || lower === ""){
        this.setState({error_lower: "Make sure: value is less than upper limit and greater than 30"});
      }
      else{
        this.setState({error_lower: ""});
      }

      if(upper > 225 || upper < lower || upper === ""){
        this.setState({error_upper: "Make sure: value is greater than upper limit and less than 225"});
      }
      else{
        this.setState({error_upper: ""});
      }

      if(atrial_amp > 7 || atrial_amp < 0 || atrial_amp === ""){
        this.setState({error_atrial_amp: "Make sure: value is between 0V and 7V"});
      }
      else{
        this.setState({error_atrial_amp: ""});
      }

      if(atrial_pw > 2 || atrial_pw < 0 || atrial_pw === ""){
        this.setState({error_atrial_pw: "Make sure: value is between 0V and 2ms"});
      }
      else{
        this.setState({error_atrial_pw: ""});
      }

      if(arp > 2 || arp < 0 || arp === ""){
        this.setState({error_arp: "Make sure: value is between 150ms and 500ms"});
      }
      else{
        this.setState({error_arp: ""});
      }

      if(this.state.error_atrial_pw === "" && this.state.error_atrial_amp === ""  && this.state.error_upper === "" && this.state.error_lower === "" && this.state.error_arp === ""){
        //all errors clean
        //then do submit action
        this.setState({communication: true});
      }
    }
    
    render() {
      return (

          <div className="box">
  
            <div className="input-group2">
              <label>Lower Rate Limit</label>
              {this.state.error_lower === "" ? <div></div> : <div className="error-message">{this.state.error_lower}</div>}
              <input
                type="text"
                name="lower"
                id="lower"
                className="login-input"/>
            </div>
  
            <div className="input-group2">
              <label>Upper Rate Limit</label>
              {this.state.error_upper === "" ?  <div></div> : <div className="error-message">{this.state.error_upper}</div>}
              <input
                type="text"
                name="upper"
                id="upper"
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Atrial Amplitude</label>
              {this.state.error_atrial_amp === "" ? <div></div> : <div className="error-message">{this.state.error_atrial_amp}</div>}
              <input
                type="text"
                name="atrial-amp"
                id="atrial-amp"
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Atrial Pulse Width</label>
              {this.state.error_atrial_pw === "" ? <div></div> : <div className="error-message">{this.state.error_atrial_pw}</div>}
              <input
                type="text"
                name="atrial-pw"
                id="atrial-pw"
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>ARP</label>
              {this.state.error_arp === "" ? <div></div> : <div className="error-message">{this.state.error_arp}</div>}
              <input
                type="text"
                name="arp"
                id="arp"
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

  export default AAI;