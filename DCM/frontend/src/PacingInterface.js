import React from 'react';
import AOO from './AOO';

class PacingInterface extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        isAOO: true,
        isVOO: false,
        isAAI: false,
        isVVI: false

      };
    }
  
    showAOOBox() {
      this.setState({
        isAOO: true,
        isVOO: false,
        isAAI: false,
        isVVI: false
        }
      );
    }
  
    showVOOBox() {
        this.setState({
          isAOO: false,
          isVOO: true,
          isAAI: false,
          isVVI: false
          }
        );
    }

    showAAIBox() {
        this.setState({
          isAOO: false,
          isVOO: false,
          isAAI: true,
          isVVI: false
          }
        );
    }

    showVVIBox() {
        this.setState({
          isAOO: false,
          isVOO: false,
          isAAI: false,
          isVVI: true
          }
        );
    }
  
    render() {
  
      return (
        <div className="root-container">
          
          <div className="box-controller">
            <div
              className={"controller " + (this.state.isAOO
              ? "selected-controller"
              : "")}
              onClick={this
              .showAOOBox
              .bind(this)}>
              AOO
            </div>
            <div
              className={"controller " + (this.state.isVOO
              ? "selected-controller"
              : "")}
              onClick={this
              .showVOOBox
              .bind(this)}>
              VOO
            </div>
            <div
              className={"controller " + (this.state.isAAI
              ? "selected-controller"
              : "")}
              onClick={this
              .showAAIBox
              .bind(this)}>
              AAI
            </div>
            <div
              className={"controller " + (this.state.isVVI
              ? "selected-controller"
              : "")}
              onClick={this
              .showVVIBox
              .bind(this)}>
              VVI
            </div>
          </div>
  
          <div className="interface-container">
            {this.state.isAOO && <AOO/>}
          </div>
  
        </div>
  
      );
    }
  
  }
  
  export default PacingInterface;