import React, { Component } from 'react';
import '../styles.css';
import axios from 'axios';
import RenderPriceComponent from './RenderPriceComponent';
import { data } from 'cheerio/lib/api/attributes';

export default class WatchListComponent extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             data : [],
             nameData:[],
             searchItem : '',
             allCompanyData : [],
             dataToBeSearched : [],
             relatedResults : {display : 'none'},
             sName : '',
             companyCode : '',
             userId : '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSearchedItem = this.onSearchedItem.bind(this);
    }
    componentDidMount(){
        var referenceVariable = sessionStorage.getItem("username");
        var responseArray = [];
        this.setState({
            ...this.state,userId:referenceVariable
        });
        axios.get('/fdata')
             .then(res=>{
                 this.setState({
                     ...this.state,allCompanyData : res.data
                 })
             })
        var ddd = []
        axios.post('/fetch/watchlistdata',{userId : referenceVariable})
             .then(res=>{
                (async ()=>{

                    for(var i=0;i<res.data.length;i++){
                        ddd.push({id:ddd.length, name : res.data[i].companyName,companyC : res.data[i].companyCode});
                        this.setState({
                            ...this.state,nameData : ddd,
                        })
                        
                        await new Promise(r => setTimeout(r, 200));
                        var val = res.data[i].companyCode;
                        axios
                            .get('https://money.rediff.com/money1/currentstatus.php?companycode='+res.data[i].companyCode)
                            .then(res1=>{
                                
                                responseArray.push({
                                    id : responseArray.length,
                                    price : res1.data.LastTradedPrice,
                                    change : res1.data.Change,
                                    companyC : val,
                                    percent_change : res1.data.ChangePercent,
                                })
                                responseArray.sort((a,b)=>{
                                    return a.id < b.id;
                                })
                                this.setState({
                                    ...this.state,data : responseArray
                                })
                            })
                    }
                })()
                

             })
        
    }
    handleSubmit = event =>{
        event.preventDefault();
        var ref = this.state.data;
        var namedata1 = this.state.nameData;
        namedata1.push({id:namedata1.length, name : this.state.sName,companyC : this.state.companyCode});
        axios
            .get('https://money.rediff.com/money1/currentstatus.php?companycode='+this.state.companyCode)
            .then(res1=>{
                ref.push({
                    id : ref.length,
                    price : res1.data.LastTradedPrice,
                    change : res1.data.Change,
                    percent_change : res1.data.ChangePercent
                })
                this.setState({
                    ...this.state,data : ref,nameData : namedata1
                })
            })
        const dataPassed = {
            userId : sessionStorage.getItem("username"),
            sName : this.state.sName,
            companyCode : this.state.companyCode
        }
        axios
            .post('/add/towatchlistdata',{...dataPassed})
            .then(res=>{
            })
        

    }

    deleteStock(idd){
        console.log(idd);
        axios
            .post('/add/deleteStock',{companyName : this.state.nameData[idd].name,userId : sessionStorage.getItem("username")})
            .then(res=>{
                var refdata = [];
                var nData = [];
                for(var i=0;i<this.state.nameData.length;i++){
                    if(i == idd) continue;
                    refdata.push({
                        ...this.state.data[i],id : refdata.length
                    })
                    nData.push({
                        ...this.state.nameData[i],id : nData.length
                    })
                }
                this.setState({
                    ...this.state,data : refdata,nameData : nData
                })
            },err=>console.log(err))
            .catch(err=>console.log(err));
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
    
    render() {
        const dataSet = this.state.data.map((stock)=>{
            return(
                <div className = "stock-container" key = {stock.id}>
                    <h1 className= "text-medium-small first-name in-watchlist"><b>{this.state.nameData[stock.id].name}</b></h1>
                    <div className = "watchrendercomp">
                    {console.log(this.state.nameData[stock.id])}
                    <RenderPriceComponent price = {stock.price} change = {stock.change} pchange = {stock.percent_change} cc = {this.state.nameData[stock.id].companyC}/>
                    </div>
                    <div className = "operations">
                        <div className = "op op1">
                        <div className = "delete-button-image" onClick = {()=>{this.deleteStock(stock.id)}}></div>
                        </div>
                    </div>
                </div>
            )
        })
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
                <h1 className = "main-text">Watch List</h1>
                <form className = "form-control" onSubmit ={this.handleSubmit}>
                    <input className = "search-input text-medium-small"type = "text" placeholder ="Search Here" onChange={this.handleChange} value = {this.state.sName}></input>
                    <button type = "submit" className = "btn">Add</button>
                </form>
                <br>
                </br>
                <br></br>
                <div className = "searchBar" style = {this.state.relatedResults}>
                    {searchedData}
                    <div className = "search-data-container text-blue">
                        <h1 className = "text-medium">{searchedData.length} Data Found</h1>
                        <h1 className = "text-medium-small">Click to Select</h1>
                    </div>
                </div>
                <div className = "dataset">
                {dataSet}</div>
            </div>
        )
    }
}
