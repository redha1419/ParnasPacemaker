import React, {createContext, Component} from 'react';

export const AuthContext = createContext();

class AuthContextProvier extends Component {
    state = {
        auth: false,
        username: ""
    }
    authenticate = (username) => {
        this.setState({auth : true, username: username});
    }
    unAuthenticate = () => {
        this.setState({auth : false, username: ""});
    }
    render(){
        return (
        <AuthContext.Provider value={{...this.state, authenticate: this.authenticate, unAuthenticate: this.unAuthenticate}}>
            {this.props.children}
        </AuthContext.Provider>);
    };
}

export default AuthContextProvier;

