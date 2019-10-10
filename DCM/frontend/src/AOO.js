import React from 'react';

class AOO extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
    }
    
    render() {
      return (
        <div className="inner-container">

          <div className="box">
  
            <div className="input-group">
              <label>Lower Rate Limit</label>
              <input
                type="text"
                name="lower"
                className="login-input"/>
            </div>
  
            <div className="input-group">
              <label>Upper Rate Limit</label>
              <input
                type="text"
                name="upper"
                className="login-input"/>
            </div>
  
            <button
              type="button"
              className="login-btn">Start!</button>
          </div>
        </div>
      );
    }
  
  }

  export default AOO;