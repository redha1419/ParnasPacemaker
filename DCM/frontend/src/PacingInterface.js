import React from 'react';
import {Route} from 'react-router-dom';
import AOO from './AOO';
import VOO from './VOO';
import AAI from './AAI';
import VVI from './VVI';
import {AuthContext} from './contexts/AuthContext';
import axios from 'axios';

class PacingInterface extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
      super(props);
      this.state = {
        isAOO: true,
        isVOO: false,
        isAAI: false,
        isVVI: false,
        previous_maker:"",
        current_maker:""

      };
    }

    componentDidMount(){
      axios.post('http://localhost:3000/getConfig',  {
        username: this.context.username
        })
        .then( res =>{
          this.setState({
            previous_maker: res.data.config.pacemaker_id
          });
        })
        .catch(err =>{
          console.log(err)
      }) 
      this.setState({current_maker: "456"})
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
      console.log(this.context)
      if(!this.context.auth){
        this.props.history.push('/')
      }
      return (
        <div className="root-container">
        <div style={{paddingBottom: "50px",fontSize: "20px", color:"green"}}>
        Current pacemaker is {this.state.current_maker} and the previous one is {this.state.previous_maker}
        </div>
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