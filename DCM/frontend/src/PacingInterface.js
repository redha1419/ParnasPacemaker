import React from 'react';
import {Route} from 'react-router-dom';
import AOO from './AOO';
import VOO from './VOO';
import AAI from './AAI';
import VVI from './VVI';
import DOO from './DOO'; 
import AOOR from './AOOR'; 
import VOOR from './VOOR'; 
import AAIR from './AAIR'; 
import VVIR from './VVIR'; 
import DOOR from './DOOR'; 
import {AuthContext} from './contexts/AuthContext';
import axios from 'axios';
import logo from './pacemaker_logo.png';

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
        isAOOR: false, 
        isVOOR: false,
        isAAIR: false, 
        isVVIR: false, 
        isDOOR: false,
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
            previous_maker: res.data.config.pacemaker_id
          });
        })
        .catch(err =>{
          console.log(err)
      }) 
      this.setState({current_maker: "456"})     //placeholder value, actual ID will be serially transmitted in future
    }
  
    //functionality for tab buttons, displays pacing mode according to respective tab that is active
    showAOOBox() {
      this.setState({
        isAOO: true,
        isVOO: false,
        isAAI: false,
        isVVI: false, 
        isDOO: false, 
        isAOOR: false, 
        isVOOR: false,
        isAAIR: false, 
        isVVIR: false, 
        isDOOR: false
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
          isDOO: false, 
          isAOOR: false,
          isVOOR: false,
          isAAIR: false, 
          isVVIR: false, 
          isDOOR: false
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
          isDOO: false, 
          isAOOR: false,
          isVOOR: false,
          isAAIR: false, 
          isVVIR: false, 
          isDOOR: false
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
          isDOO: false, 
          isAOOR: false,
          isVOOR: false,
          isAAIR: false, 
          isVVIR: false, 
          isDOOR: false
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
        isDOO: true, 
        isAOOR: false,
        isVOOR: false,
        isAAIR: false, 
        isVVIR: false, 
        isDOOR: false
        }
      );
      this.props.history.push('/pacing-interface/DOO');
  }

    showAOORBox() {
    this.setState({
      isAOO: false,
      isVOO: false,
      isAAI: false,
      isVVI: false, 
      isDOO: false, 
      isAOOR: true,
      isVOOR: false,
      isAAIR: false, 
      isVVIR: false, 
      isDOOR: false
      }
    );
    this.props.history.push('/pacing-interface/AOOR');
  } 

  showVOORBox() {
    this.setState({
      isAOO: false,
      isVOO: false,
      isAAI: false,
      isVVI: false, 
      isDOO: false, 
      isAOOR: false,
      isVOOR: true,
      isAAIR: false, 
      isVVIR: false, 
      isDOOR: false
      }
    );
    this.props.history.push('/pacing-interface/VOOR');
  } 

  showAAIRBox() {
    this.setState({
      isAOO: false,
      isVOO: false,
      isAAI: false,
      isVVI: false, 
      isDOO: false, 
      isAOOR: false,
      isVOOR: false,
      isAAIR: true, 
      isVVIR: false, 
      isDOOR: false
      }
    );
    this.props.history.push('/pacing-interface/AAIR');
  } 

  showVVIRBox() {
    this.setState({
      isAOO: false,
      isVOO: false,
      isAAI: false,
      isVVI: false, 
      isDOO: false, 
      isAOOR: false,
      isVOOR: false,
      isAAIR: false, 
      isVVIR: true, 
      isDOOR: false,
      }
    );
    this.props.history.push('/pacing-interface/VVIR');
  } 

  showDOORBox() {
    this.setState({
      isAOO: false,
      isVOO: false,
      isAAI: false,
      isVVI: false, 
      isDOO: false, 
      isAOOR: false,
      isVOOR: false,
      isAAIR: false, 
      isVVIR: false, 
      isDOOR: true
      }
    );
    this.props.history.push('/pacing-interface/DOOR');
  } 
  
    render() {
      console.log(this.context)
      if(!this.context.auth){
        this.props.history.push('/')
      }
      return (
        <div className="root-container">
        <img style={{paddingBottom:"30px"}}src={logo} alt="logo" onClick={()=>{this.props.history.push('/home/login')}}/>
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
            <div
              className={"controller " + (this.state.isDOO
              ? "selected-controller"
              : "")}
              onClick={this
              .showDOOBox
              .bind(this)}>
              DOO
            </div>
            <div
              className={"controller " + (this.state.isAOOR
              ? "selected-controller"
              : "")}
              onClick={this
              .showAOORBox
              .bind(this)}>
              AOOR
            </div>

            <div
              className={"controller " + (this.state.isVOOR
              ? "selected-controller"
              : "")}
              onClick={this
              .showVOORBox
              .bind(this)}>
              VOOR
            </div>

            <div
              className={"controller " + (this.state.isAAIR
              ? "selected-controller"
              : "")}
              onClick={this
              .showAAIRBox
              .bind(this)}>
              AAIR
            </div>

            <div
              className={"controller " + (this.state.isVVIR
              ? "selected-controller"
              : "")}
              onClick={this
              .showVVIRBox
              .bind(this)}>
              VVIR
            </div>

            <div
              className={"controller " + (this.state.isDOOR
              ? "selected-controller"
              : "")}
              onClick={this
              .showDOORBox
              .bind(this)}>
              DOOR
            </div>
          </div>
          
          <div className="interface-container">
            <Route path="/pacing-interface/AOO" exact component={AOO} />
            <Route path="/pacing-interface/VOO" exact component={VOO} />
            <Route path="/pacing-interface/AAI" exact component={AAI} />
            <Route path="/pacing-interface/VVI" exact component={VVI} />
            <Route path="/pacing-interface/DOO" exact component={DOO} />
            <Route path="/pacing-interface/AOOR" exact component={AOOR}/>
            <Route path="/pacing-interface/VOOR" exact component={VOOR}/>
            <Route path="/pacing-interface/AAIR" exact component={AAIR}/>
            <Route path="/pacing-interface/VVIR" exact component={VVIR}/>
            <Route path="/pacing-interface/DOOR" exact component={DOOR}/>
          </div>
        </div>
  
      );
    }
  
  }
  
  export default PacingInterface;