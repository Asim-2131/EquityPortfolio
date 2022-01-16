import React, { Component } from 'react'
import {Link} from 'react-router-dom';

export default class LogoutComponent extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
             name : '',
        }
    }
    
    componentDidMount(){
        this.setState({
            ...this.state,name : sessionStorage.getItem('username')
        })
        sessionStorage.removeItem('username');
    }
    render() {
        return (
            <div className = "all-component-container">
                <p className ="text-medium"> thanx for visiting out site come back soon {this.state.name}</p>
                <Link to = "/login" className = "text-medium-small" >Login Again{"=>"}</Link>
            </div>
        )
    }
}
