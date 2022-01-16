import axios from 'axios';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
export default class LoginComponent extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
             username : '',
             password : '',
             isOk : 'false',
             message : '',
             isSignUp : false,
        }
    }
    
    handleSubmit = (event) =>{

        event.preventDefault();
        axios
            .post('/authenticate/login' ,{...this.state})
            .then(res => {
                const val = res.data;
                this.setState({
                    ...this.state,isOk : val.isOk
                })
                if(!val.isOk){
                    this.setState({
                        ...this.state, message : "Username Or Password Incorrect"
                    })
                }
                else{
                    this.setState({
                        ...this.state, message : "Correct"
                    })
                    sessionStorage.setItem("username",this.state.username)
                    window.location.href = "./home";
                }
            })

    }

    handleChange = (event)=>{
        const {name,value} = event.target;
        this.setState({
            ...this.state,
            [name] : value
        })
    }

    componentDidMount(){

    }

    signUp=()=>{
        this.setState({
            ...this.state,isSignUp : true,
        })
    }
    render() {
        if(this.state.isSignUp){
            return(<Redirect to = "/signup"></Redirect>)
        }
        return (
            <div className = "bg-image">
                <div className = "main-login-box">
                    <div className = "login-header">
                        <div className = "login-image"></div>
                        <h1 className = "text-medium">Login</h1>
                    </div>
                    <div className = "login-body">
                        <form onSubmit = {this.handleSubmit}>
                            <input type = "text" placeholder = "Username" className = "login-input" name = "username" id = "username" onChange = {this.handleChange}></input>
                            <input type = "password" placeholder = "Password" className = "login-input" name = "password" id = "password" onChange = {this.handleChange}></input>
                            <div className = "for-pass-log">
                                <button type = "submit" className = "btn btn-signup ">Login</button>
                            </div>
                            {this.state.message}
                        </form>
                    </div>
                    <div className = "login-footer"><div className  = "text-small">Don't have an account ? </div>
                        <button className = "btn btn-signup" onClick = {this.signUp}>Sign Up</button>
                    </div>
                </div>
            </div>
        )
    }
}
