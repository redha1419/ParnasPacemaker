import React from 'react';

class VVI extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        error_lower:"",
        error_upper:"",
        error_ventricular_amp:"",
        error_ventricular_pw:"",
        error_vrp:"",
        communication: false
      };
    }

    submit(e){
      //first check all values
      let lower = document.getElementById('lower').value;
      let upper = document.getElementById('upper').value;
      let ventricular_amp = document.getElementById('ventricular-amp').value;
      let ventricular_pw = document.getElementById('ventricular-pw').value;
      let vrp = document.getElementById('vrp').value;

      console.log(lower)
      console.log(upper)
      console.log(ventricular_amp)
      console.log(ventricular_pw)

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

      if(ventricular_amp > 7 || ventricular_amp < 0 || ventricular_amp === ""){
        this.setState({error_ventricular_amp: "Make sure: value is between 0V and 7V"});
      }
      else{
        this.setState({error_ventricular_amp: ""});
      }

      if(ventricular_pw > 2 || ventricular_pw < 0 || ventricular_pw === ""){
        this.setState({error_ventricular_pw: "Make sure: value is between 0V and 2ms"});
      }
      else{
        this.setState({error_ventricular_pw: ""});
      }


      if(vrp > 500 || vrp < 150 || vrp === ""){
        this.setState({error_vrp: "Make sure: value is between 150ms and 500ms"});
      }
      else{
        this.setState({error_vrp: ""});
      }

      if(this.state.error_ventricular_pw === "" && this.state.error_ventricular_amp === ""  && this.state.error_upper === "" && this.state.error_lower === "" && this.state.error_vrp === ""){
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
              {this.state.error_lower === "" ?  <div></div> : <div className="error-message">{this.state.error_lower}</div> }
              <input
                type="text"
                name="lower"
                id="lower"
                className="login-input"/>
            </div>
  
            <div className="input-group2">
              <label>Upper Rate Limit</label>
              {this.state.error_upper === "" ? <div></div> : <div className="error-message">{this.state.error_upper}</div>}
              <input
                type="text"
                name="upper"
                id="upper"
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Ventricular Amplitude</label>
              {this.state.error_ventricular_amp === "" ? <div></div> : <div className="error-message">{this.state.error_ventricular_amp}</div>}
              <input
                type="text"
                name="ventricular-amp"
                id="ventricular-amp"
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Ventricular Pulse Width</label>
              {this.state.error_ventricular_pw === "" ? <div></div> :  <div className="error-message">{this.state.error_ventricular_pw}</div>}
              <input
                type="text"
                name="ventricular-pw"
                id="ventricular-pw"
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>VRP</label>
              {this.state.error_vrp === "" ? <div></div> :  <div className="error-message">{this.state.error_vrp}</div>}
              <input
                type="text"
                name="vrp"
                id="vrp"
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

  export default VVI;