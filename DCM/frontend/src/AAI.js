import React from 'react';

class AAI extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
    }
    
    render() {
      return (
          <div className="box">
  
            <div className="input-group2">
              <label>Lower Rate Limit</label>
              <input
                type="text"
                name="lower"
                className="login-input"/>
            </div>
  
            <div className="input-group2">
              <label>Upper Rate Limit</label>
              <input
                type="text"
                name="upper"
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Atrial Amplitude</label>
              <input
                type="text"
                name="upper"
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>Atrial Pulse Width</label>
              <input
                type="text"
                name="upper"
                className="login-input"/>
            </div>

            <div className="input-group2">
              <label>ARP</label>
              <input
                type="text"
                name="upper"
                className="login-input"/>
            </div>
  
            <button
              type="button"
              className="login-btn">Start!</button>
          </div>
      );
    }
  
  }

  export default AAI;