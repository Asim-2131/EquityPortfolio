import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import '../styles.css';


export default class HeaderComponent extends Component {

    logout=()=>{
        window.location.href = "./logout";
    }
    render() {
        return (
            <div className = "header">
                <div className = "navbar container">
                    <div className = "logo">
                        SM
                    </div>
                    <div className = "options">
                        <ul>
                            <li><NavLink className = "nav-items" to = '/home'>Home</NavLink></li>
                            <li><NavLink className = "nav-items" to = '/watchlist'>Watchlist</NavLink></li>
                            <li><NavLink className = "nav-items dropdown" to = '/portfolio'>
                                Portfolio
                                <div className="dropdown-content">
                                    <NavLink className = "nav-items inner" to = "/portfolio">Your Portfolio</NavLink>
                                    <NavLink className = "nav-items inner" to = "/addStockForm">Add to Portfolio</NavLink>
                                </div>
                                </NavLink>
                            </li>
                            {sessionStorage.getItem('username') == null ? <li><NavLink className = "nav-items" to = '/login'>Login</NavLink></li>
                            : <></>}
                            {sessionStorage.getItem('username') == null ? <li><NavLink className = "nav-items" to = '/signup'>SignUp</NavLink></li> : <></>}
                            {sessionStorage.getItem('username') != null? <li><NavLink className = "nav-items" to="" onClick = {this.logout}>Logout</NavLink></li> : <></>}
                        </ul>
                    </div>
                </div>                
            </div>
        )
    }
}
