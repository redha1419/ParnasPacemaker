import React from 'react';
import {Route} from 'react-router-dom';
import AOO from './AOO';
import VOO from './VOO';
import AAI from './AAI';
import VVI from './VVI';

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
      this.props.history.push('/pacing-interface/AOO');
    }
  
    showVOOBox() {
        this.setState({
          isAOO: false,
          isVOO: true,
          isAAI: false,
          isVVI: false
          }
        );
        this.props.history.push('/pacing-interface/VOO');
    }

    showAAIBox() {
        this.setState({
          isAOO: false,
          isVOO: false,
          isAAI: true,
          isVVI: false
          }
        );
        this.props.history.push('/pacing-interface/AAI');

    }

    showVVIBox() {
        this.setState({
          isAOO: false,
          isVOO: false,
          isAAI: false,
          isVVI: true
          }
        );
        this.props.history.push('/pacing-interface/VVI');
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
            <Route path="/pacing-interface/AOO" exact component={AOO} />
            <Route path="/pacing-interface/VOO" exact component={VOO} />
            <Route path="/pacing-interface/AAI" exact component={AAI} />
            <Route path="/pacing-interface/VVI" exact component={VVI} />
          </div>
  
        </div>
  
      );
    }
  
  }
  
  export default PacingInterface;