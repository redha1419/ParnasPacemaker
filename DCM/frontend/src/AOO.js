import React from 'react';

class AOO extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        error_lower:"",
        error_upper:"",
        error_atrial_amp:"",
        error_atrial_pw:"",
        communication: false
      };
    }

    submit(e){
      //first check all vals
      let lower = document.getElementById('lower').value;
      let upper = document.getElementById('upper').value;
      let atrial_amp = document.getElementById('atrial-amp').value;
      let atrial_pw = document.getElementById('atrial-pw').value;

      let error = false

      if(lower < 30 || upper < lower || lower === ""){
        this.setState({error_lower: "Make sure: value is less than upper limit and greater than 30"});
        error = true;
      }
      else{
        this.setState({error_lower: ""});
      }

      if(upper > 225 || upper < lower || upper === ""){
        this.setState({error_upper: "Make sure: value is greater than upper limit and less than 225"});
        error = true;
      }
      else{
        this.setState({error_upper: ""});
      }

      if(atrial_amp > 7 || atrial_amp < 0 || atrial_amp === ""){
        this.setState({error_atrial_amp: "Make sure: value is between 0V and 7V"});
        error = true;
      }
      else{
        this.setState({error_atrial_amp: ""});
      }

      if(atrial_pw > 2 || atrial_pw < 0 || atrial_pw === ""){
        this.setState({error_atrial_pw: "Make sure: value is between 0V and 2ms"});
        error = true;
      }
      else{
        this.setState({error_atrial_pw: ""});
      }

      if(!error){
        //all errors clean
        //then do submit action
        axios.post('http://localhost:3000/pacing',  {
          username,
          password
          })
          .then( res =>{
            if(res.data.auth === true){
              this.context.authenticate(username);
              this.props.history.push('/pacing-interface/AOO');
            } 
          })
          .catch(err =>{
            this.setState({error: true, error_message: err.message})
            console.log(err);
        }) 

        this.setState({communication: true});
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
  
            <button
              type="button"
              onClick={this.submit.bind(this)}
              className="login-btn">Start!</button>
          </div>
      );
    }
  
  }

  export default AOO;