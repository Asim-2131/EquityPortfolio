import axios from 'axios';
import React, { Component } from 'react';
import { Redirect } from 'react-router';

export default class LogoutComponent extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
            firstname : '',
            lastname : '', 
            username : '',
            password : '',
            cpassword:'',
            isLogIn : false,
            messagep : "",
            isOk : false
        }
    }
    
    handleSubmit = (event) =>{

        event.preventDefault();
        if(this.state.password != this.state.cpassword){
            this.setState({
                ...this.state,messagep : "Your both passwords are not same"
            })
            
        }
        else{

            axios
                .post('/authenticate/signup',{...this.state})
                .then(res=>{
                    this.setState({
                        ...this.state,messagep : res.data.message,isOk : res.data.isOk
                    })
                })
        }
    }

    handleChange = (event)=>{
        const {name,value} = event.target;
        this.setState({
            ...this.state,
            [name] : value
        })
    }

    logIn = () =>{
        this.setState({
            ...this.state,isLogIn : true,
        })
    }
    componentDidMount(){

    }

    render() {
        if(this.state.isLogIn || this.state.isOk){
            return(<Redirect to = "/login"></Redirect>)
        }
        return (
            <div className = "bg-image">
                <div className = "main-login-box">
                    <div className = "login-header">
                        <div className = "login-image"></div>
                        <h1 className = "text-medium">Sign Up</h1>
                    </div>
                    <div className = "login-body">
                        <form onSubmit = {this.handleSubmit}>
                            <input type = "text" placeholder = "FirstName" className = "signup-flname" name = "firstname" id = "firstname" onChange = {this.handleChange}required ></input>
                            <input type = "text" placeholder = "LastName" className = "signup-flname" name = "lastname" id = "lastname" onChange = {this.handleChange} required ></input>
                            <input type = "text" placeholder = "Username" className = "signup-input" name = "username" id = "username" onChange = {this.handleChange} required ></input>
                            <input type = "password" placeholder = "Password" className = "signup-input" name = "password" id = "password" onChange = {this.handleChange} required ></input>
                            <input type = "password" placeholder = "Confirm Password" className = "signup-input" name = "cpassword" id = "cpassword" onChange = {this.handleChange} required ></input>
                            {this.state.messagep}
                            <div className = "for-pass-log">
                                <button type = "submit" className = "btn btn-signup ">Sign Up</button>
                            </div>
                            {this.state.message}
                        </form>
                    </div>
                    <div className = "login-footer"><div className  = "text-small">You have an account ? </div>
                        <button className = "btn btn-signup" onClick = {this.logIn}>Login</button>
                    </div>
                </div>
            </div>
        )
    }
}
