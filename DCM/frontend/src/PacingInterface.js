import React from 'react';
import {Route} from 'react-router-dom';
import AOO from './AOO';
import VOO from './VOO';
import AAI from './AAI';
import VVI from './VVI';
import DOO from './DOO'; 
import {AuthContext} from './contexts/AuthContext';
import axios from 'axios';
import logo from './pacemaker_logo.png';
import electrogram_logo from './electrogram.svg'

class PacingInterface extends React.Component {
    static contextType = AuthContext;
    //Upon entering the pacing interface, the default mode displayed is AOO
    constructor(props) {
      super(props);
      this.state = {
        isAOO: true,
        isVOO: false,
        isAAI: false,
        isVVI: false,
        isDOO: false,
        previous_maker:"",
        current_maker:""

      };
    }

    //when pacing interface is first accessed, receive the ID of the pacemaker that was previously used by the current user
    componentDidMount(){
      axios.post('http://localhost:3000/getConfig',  {
        username: this.context.username
        })
        .then( res =>{
          this.setState({
            previous_maker: res.data.config.pacemaker_id,
            current_maker: res.data.device
          });
        })
        .catch(err =>{
          console.log(err)
      }) 
    }
  
    //functionality for tab buttons, displays pacing mode according to respective tab that is active
    showAOOBox() {
      this.setState({
        isAOO: true,
        isVOO: false,
        isAAI: false,
        isVVI: false, 
        isDOO: false
        }
      );
      this.props.history.push('/pacing-interface/AOO');
    }
  
    showVOOBox() {
        this.setState({
          isAOO: false,
          isVOO: true,
          isAAI: false,
          isVVI: false,
          isDOO: false
          }
        );
        this.props.history.push('/pacing-interface/VOO');
    }

    showAAIBox() {
        this.setState({
          isAOO: false,
          isVOO: false,
          isAAI: true,
          isVVI: false,
          isDOO: false
          }
        );
        this.props.history.push('/pacing-interface/AAI');

    }

    showVVIBox() {
        this.setState({
          isAOO: false,
          isVOO: false,
          isAAI: false,
          isVVI: true, 
          isDOO: false
          }
        );
        this.props.history.push('/pacing-interface/VVI');
    }

    showDOOBox() {
      this.setState({
        isAOO: false,
        isVOO: false,
        isAAI: false,
        isVVI: false, 
        isDOO: true
        }
      );
      this.props.history.push('/pacing-interface/DOO');
  }

   
  
    render() {
      console.log(this.context)
      if(!this.context.auth){
        this.props.history.push('/')
      }
      return (
        <div>
        <img style={{float:"left"}}src={electrogram_logo} alt="logo" onClick={()=>{this.props.history.push('/electrogram')}} width="100" height="50"/>
        <div className="root-container">
        <img style={{paddingBottom:"30px"}}src={logo} alt="logo" onClick={()=>{this.props.history.push('/home/login')}}/>
        <div style={{paddingBottom: "50px",fontSize: "20px", color:"green"}}>
        Current pacemaker is {this.state.current_maker} and the original user's is {this.state.previous_maker}
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
            <div
              className={"controller " + (this.state.isDOO
              ? "selected-controller"
              : "")}
              onClick={this
              .showDOOBox
              .bind(this)}>
              DOO
            </div>
          </div>
          
          <div className="interface-container">
            <Route path="/pacing-interface/AOO" exact component={AOO} />
            <Route path="/pacing-interface/VOO" exact component={VOO} />
            <Route path="/pacing-interface/AAI" exact component={AAI} />
            <Route path="/pacing-interface/VVI" exact component={VVI} />
            <Route path="/pacing-interface/DOO" exact component={DOO} />
          </div>
          </div>
        </div>
  
      );
    }
  
  }
  
  export default PacingInterface;