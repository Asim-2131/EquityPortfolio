import React, { Component } from 'react'
import '../styles.css';
import axios from 'axios';

export default class RenderPriceComponent extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
            price : '',
            change : '',
            percent_change : '',
            time : 0
        }
    }
    componentDidMount() {
        axios
            .get('https://money.rediff.com/money1/currentstatus.php?companycode='+this.props.cc)
            .then(res1=>{
                console.log(res1.data.LastTradedPrice,' ',res1.data.Change,' ',res1.data.ChangePercent);
                this.setState({ 
                    price : res1.data.LastTradedPrice,
                    change : res1.data.Change,
                    percent_change : res1.data.ChangePercent });
            })
        
    }
    componentWillUnmount() {
        
        clearInterval(this.interval);
    }
    render() {
        
        return (
                
                <div className = "render-component">
                    <div className = "stock-price">
                        <h1 className = "text-medium">{this.state.price ? this.state.price : this.props.price}  </h1>
                        <h1 className = "text-small">{this.state.change ? this.state.change : this.props.change} ({this.state.percent_change ? this.state.percent_change : this.props.pchange}%)  </h1>
                    </div>
                    {Number(this.state.change ? this.state.change : this.props.change) < 0 ?<div className = "color-div-decrease"></div> : <div className = "color-div-increase"></div> }
                   
                </div>
        )
    }
}
