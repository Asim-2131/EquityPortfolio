import React, { Component } from 'react';
import HeaderComponent from './HeaderComponent';
import {Switch,BrowserRouter as Router, Route,Redirect} from 'react-router-dom';
import HomeComponent from './HomeComponent';
import WatchListComponent from './WatchListComponent';
import PortfolioComponent from './PortfolioComponent';
import LoginComponent from './LoginComponent';
import FormComponent from './FormComponent';
import LogoutComponent from './LogoutComponent';
import SignupComponent from './SignupComponent';
import FooterComponent from './FooterComponent';
export default class MainComponent extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    

    render() {
        return (
            <div>
                <Router>
                    {sessionStorage.getItem('username')!=null ? <HeaderComponent/> : <></>}
                    <Switch>
                        <Route path = "/home"><HomeComponent/></Route>
                        <Route path = "/watchlist"><WatchListComponent/></Route>
                        <Route path = "/portfolio"><PortfolioComponent/></Route>
                        <Route path = "/login"><LoginComponent/></Route>
                        <Route path = "/addStockForm"><FormComponent/></Route>
                        <Route exact path = "/logout"><LogoutComponent/></Route>
                        <Route path = "/signup"><SignupComponent/></Route>
                        <Redirect to = "/login"/>
                    </Switch>
                    {sessionStorage.getItem('username')!=null ? <FooterComponent/>:<></>}
                </Router>
            </div>
        )
    }
}
