import React, { Component } from 'react';
import '../styles.css';

export default class FooterComponent extends Component {
    render() {
        return (
            <>
               <div className = "footer">
                   <h2 style = {{display : "inline-block"}}>Created by <div style = {{color : "grey"}}>Vora Mahammadasim</div></h2>
               </div>
            </>
        )
    }
}
