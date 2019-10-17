import React, {createContext, Component} from 'react';

export const AuthContext = createContext();

class AuthContextProvier extends Component {
    state = {
        auth: false
    }
    authenticate = () => {
        this.setState({auth : true});
    }
    unAuthenticate = () => {
        this.setState({auth : false});
    }
    render(){
        return (
        <AuthContext.Provider value={{...this.state, authenticate: this.authenticate, unAuthenticate: this.unAuthenticate}}>
            {this.props.children}
        </AuthContext.Provider>);
    };
}

export default AuthContextProvier;

