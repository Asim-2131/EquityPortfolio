import React, { Component } from 'react'
import axios from 'axios'

export default class FormComponent extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            allCompanyData : [],
            dataToBeSearched : [],
            relatedResults : {display : 'none'},
            sName : '',
            companyCode : '',
            userId : '',
            quantity : '',
            price : '',
        }
    }
    componentDidMount(){
        var referenceVariable = sessionStorage.getItem("username");
        this.setState({
            ...this.state,userId:referenceVariable
        });
        axios.get('/fdata')
             .then(res=>{
                 this.setState({
                     ...this.state,allCompanyData : res.data
                 })
             })
    }
    
    handleChange = event=>{

        
        const value = event.target.value;
        this.setState({
            ...this.state , dataToBeSearched : []
        })
        var referencedData = [];
        for(var i = 0;i<this.state.allCompanyData.length;i++){
            const name = this.state.allCompanyData[i].name.toLowerCase();
            if(name.search(value.toLowerCase()) >= 0){
                
                referencedData.push(this.state.allCompanyData[i]);
            }
        }
        if(value.length > 0 && referencedData.length > 0)
        this.setState({
            ...this.state,relatedResults : {display : 'block'},dataToBeSearched:referencedData,sName : value
        })
        else{
            this.setState({
                ...this.state,relatedResults : {display : 'none'},sName : value
            })
        }
        
    }
    onSearchedItem(dataName,symbol){
        
        this.setState({
            ...this.setState,relatedResults : {display : 'none'},sName :dataName,companyCode : symbol
        })

    }
    handleSubmit = event =>{
        event.preventDefault();
        const dataPassed = {
            companyCode : this.state.companyCode,
            companyName : this.state.sName,
            quantity : this.state.quantity,
            price : this.state.price,
            userId : sessionStorage.getItem("username")
        }
        axios
            .post('/add/addToPortfolio' ,{...dataPassed})
            .then(response=>{
                console.log(response.data);
                window.location.href = "./portfolio";
            },err=>console.log(err))
            .catch(err=>console.log(err));

    }
    handle1Change = event=>{
        const {name,value} = event.target;
        this.setState({
            ...this.state,
            [name] : value
        })
    }
    
    render() {
        const searchedData = this.state.dataToBeSearched.map((data)=>{
            return(
                <div className = "search-data-container" onClick = {()=>{this.onSearchedItem(data.name,data.companyCode)}} key = {data._id}>
                    <h1 className = "text-medium">
                        {data.name}
                    </h1>
                </div>
            )
        })
        return (
            <div className = "all-component-container">
                <div className = "form-container">
                    <div className = "form-heading text-medium">Add Stock Data</div>
                    <form className = "add-form-container" onSubmit ={this.handleSubmit}>
                        <div className = "add-form-search-control">
                            <label className = "text-medium-small form-input-heading">Enter Company Name : </label>
                            <input className = "form-search-input text-medium-small" type = "text" placeholder ="Search Here" onChange={this.handleChange}  value = {this.state.sName}></input>
                        </div>
                        <div className = "div-qty-price-container">
                            <div className = "quantity-container">
                                <label className = "form-input-heading text-medium-small">Quantity : </label>
                                <input className = "form-search-input text-medium-small" placeholder = "Qty" onChange = {this.handle1Change} type = "number" name = "quantity" id = "quantity"></input>
                            </div>
                            <div className = "quantity-container">
                                <label className = "form-input-heading text-medium-small">Price : </label>
                                <input className = "form-search-input text-medium-small" placeholder = "Price" onChange = {this.handle1Change} type = "number" step = "0.0001" name = "price" id = "price"></input>
                            </div>
                        </div><button className = "btn btn-addStock">Add To Stock</button>
                        
                    </form>
                    <div className = "searchBar" style = {this.state.relatedResults}>
                        {searchedData}
                        <div className = "search-data-container text-blue">
                            <h1 className = "text-medium">{searchedData.length} Data Found</h1>
                            <h1 className = "text-medium-small">Click to Select</h1>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
