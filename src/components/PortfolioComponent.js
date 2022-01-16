import React, { Component } from 'react';
import '../styles.css';
import axios from 'axios';

export default class PortfolioComponent extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             data :[
                 {
                    id : 1,
                    name : 'tata',
                    qty : 100,
                    avg_price : 435.9,
                    invested : 124000,
                    ltp : 123213123,
                    p_l : 122323, 
                 }
             ],
             isClicked : false,
             particularStockData :[],
             modelOpen : {},
             updateModal : {},
             userId : '',
             fullCompanyData : [],
             selectedCompanyId : '',
             selectedCompanyName : '',
             selectedQtyId : '',
             qtyNumber:'',
             t_profit_loss : 0,
             t_investment : 0

        }
    }
    openDetails(idd){
        var qqq = [];
        for(var i=0;i<this.state.fullCompanyData[idd].qty.length;i++){
            qqq.push({
                id : qqq.length,
                qty : this.state.fullCompanyData[idd].qty[i].nos,
                price : this.state.fullCompanyData[idd].qty[i].pos,
                invested : this.state.fullCompanyData[idd].qty[i].investment,
                p_l : this.state.fullCompanyData[idd].qty[i].p_l
            })
            this.setState({
                ...this.state, particularStockData:{
                    companyName : this.state.fullCompanyData[idd].companyName,
                    qty_price : qqq
                },
                isClicked : true,
                modelOpen : {display : 'block'},
                selectedCompanyId : this.state.fullCompanyData[idd].id,
                selectedCompanyName : this.state.fullCompanyData[idd].companyName
            })
        }
    }
    componentDidMount(){
        var dataPassed = {
            userId : sessionStorage.getItem("username")
        }
        this.setState({
            ...this.state,userId : sessionStorage.getItem("username")
        })
        var allCompanyData = [];
        axios
            .post('/fetch/portfolio' , {...dataPassed})
            .then(res=>{
                //console.log(res.data);
                
                (async ()=>{
                var tttt = 0;
                var tttttt = 0;
                for(var i=0;i<res.data.length;i++){
                    const code = res.data[i].companyCode;
                    var price = '';
                    
                    axios
                        .get('https://money.rediff.com/money1/currentstatus.php?companycode='+code)
                        .then(res1=>{
                            price = (res1.data.LastTradedPrice);
                            price = price.replace(/\,/g,'');
                            price = parseFloat(price);
                            //console.log(price);
                        }).catch(err=>console.log(err));
                    await new Promise(r => setTimeout(r, 200));
                    var qty_array = [];
                    var total_investment = 0;
                    var total_profit_loss = 0;
                    var total_quantity=0;
                    for(var j=0;j<res.data[i].qty.length;j++){
                        var tt = res.data[i].qty[j];
                        var noStocks = parseFloat(tt.numberOfStocks);
                        var poStocks = parseFloat(tt.priceOfStocks);
                        console.log(noStocks + " : " + price + " : " + poStocks)
                        var investment = noStocks * poStocks;
                        var p_l = price * noStocks - investment;
                        var investment1 = parseFloat(noStocks * poStocks).toFixed(2);
                        var p_l1 = parseFloat(price * noStocks - investment).toFixed(2);
                        qty_array.push({
                            id : qty_array.length,
                            nos : tt.numberOfStocks,
                            pos : tt.priceOfStocks,
                            investment : investment1,
                            p_l : p_l1,
                        });
                        total_investment += investment;
                        total_profit_loss += p_l;
                        
                        total_quantity += noStocks;
                    }
                    tttt += total_profit_loss;
                    tttttt += total_investment;
                    var objectValue = {
                        id : allCompanyData.length,
                        companyCode : code,
                        companyName : res.data[i].companyName,
                        total_investment : total_investment,
                        total_p_l : parseFloat(total_profit_loss).toFixed(1),
                        total_qty : total_quantity,
                        current_price : price,
                        qty : qty_array
                    }
                    allCompanyData.push(objectValue);
                    this.setState({
                        ...this.state, fullCompanyData : allCompanyData
                    })
                    this.setState({
                        ...this.state,t_profit_loss : tttt,t_investment : tttttt
                    })
                }
                })()
                
            });
    }
    closeModel(){
        this.setState({
            ...this.state, modelOpen : {}
        })
    }
    updateQty(update_id){
        
        this.setState({
            ...this.state,modelOpen : {}, updateModal : {display : 'block'},selectedQtyId : update_id
        })
    }
    closeUpdateModal(){
        this.setState({
            ...this.state,modelOpen : {display : 'block'}, updateModal : {}
        })
    }
    deleteStock(idd){
        axios
            .post('/add/deletePStock',{userId : sessionStorage.getItem("username"),selectedCompanyId : idd})
            .then(res=>{
                var ref = [];
                for(var i=0;i<this.state.fullCompanyData.length;i++){
                    if(i == idd) continue;
                    else{
                        ref.push({
                            ...this.state.fullCompanyData[i],id : ref.length
                        })
                        
                    }
                   
                }
                this.setState({
                    ...this.state,fullCompanyData : ref
                })
            },err=>console.log(err))
            .catch(err=>console.log(err));    
        
    }  
    onChangeUpdatePrice=(event)=>{
        this.setState({
            ...this.state,qtyNumber : event.target.value
        })
        console.log(this.state.qtyNumber);
    }
    deleteQty(idd){
        axios
            .post('/add/deleteQty',{selectedCompanyId : this.state.selectedCompanyId,qtyId : idd,userId : sessionStorage.getItem("username")})
            .then(res=>{
                var ref = [];
                for(var i=0;i<this.state.particularStockData.qty_price.length;i++){
                    if(i == idd){
                        continue;
                    }
                    else ref.push(this.state.particularStockData.qty_price[i]);
                }
                this.setState({
                    ...this.state,particularStockData :{companyName : this.state.selectedCompanyName,qty_price : ref}  
                })
            })
    }
    submitUpdateForm=(e)=>{
        e.preventDefault();
        axios
            .post('/add/updateQty',{userId : sessionStorage.getItem("username"),companyId : this.state.selectedCompanyId,qtyId : this.state.selectedQtyId,decreaseQty : this.state.qtyNumber})
            .then(res=>{
                console.log(res.data);
                window.location.href = "./portfolio";
            },err=>console.log(err))
            .catch(err=>console.log(err));
    }
    render() {
        const dataSet = this.state.fullCompanyData.map((stock)=>{
            return(
                <div className = "stock-container" key = {stock.id}>

                    <div className="name-qty">
                        <h1 className= "text-medium-small first-name"><b>{stock.companyName}</b></h1>
                        <h1 className = "text-small">QTY : {stock.total_qty}</h1>
                    </div>
                    <div className="profit-loss">
                        <div className = "invested-curr">
                            <h1 className = "text-small">Invested : {stock.total_investment} Rs.</h1>
                            <h1 className = "text-medium-small"><b>LTP : {stock.current_price}</b></h1>
                        </div>
                        <div className = "p_l">
                            {Number(stock.total_p_l) > 0 ? <div className = "color-increase-price"><h1 className = "text-medium">{stock.total_p_l}</h1></div> : <div className = "color-decrease-price"><h1 className = "text-medium">{-1*Number(stock.total_p_l)}</h1></div>}

                        </div>
                    </div>
                    <div className = "operations">
                        <div className = "op">
                            <div className = "delete-button-image" onClick = {()=>{this.deleteStock(stock.id)}}></div>
                            <div className = "goto-button-image" onClick = {()=>this.openDetails(stock.id)}></div>
                        </div>
                    </div>
                </div>
            )
        });
        var popUpData = [];
        if(this.state.isClicked){
            popUpData = this.state.particularStockData.qty_price.map((qty_price)=>{
                return(
                    <div className = "qty-price-container" key = {qty_price.id}>
                                <div className = "qty text-medium-small">
                                    {qty_price.qty}
                                </div>
                                <div className = "price text-medium-small">
                                    {qty_price.price}
                                </div>
                                <div className = "invested text-medium-small">
                                    {qty_price.invested}
                                </div>
                                <div className = "profit-loss text-medium-small">
                                    {qty_price.p_l}
                                </div>
                                <div className = "update text-medium-small" onClick = {()=>{this.updateQty(qty_price.id)}}>
                                    
                                </div>
                                <div className = "delete-button-image" onClick = {()=>{this.deleteQty(qty_price.id)}}></div>
                    </div>
                )
            })
        }
        return (
            <div className = "all-component-container">
                <h1 className = "main-text">Your Stocks</h1><br></br>
                <h1 className = "text-medium-small vvv">Current Investment : {this.state.t_investment}</h1>
                <h1 className = "text-medium-small vvv">P/L : {this.state.t_profit_loss}</h1>
                {dataSet}
                
                <div id = "myModal" className = "modal" style = {this.state.modelOpen}>
                    <div className="modal-content">
                        <div className="modal-header-success">
                        <span className="close" onClick = {()=>this.closeModel()}>&times;</span>
                        <h2 className = "text-medium">{this.state.isClicked ? this.state.particularStockData.companyName : ''}</h2>
                        </div>
                        <div className="modal-body">
                            <div className = "table-heading">
                                <div className = "qty text-medium-small">
                                    <b>Qty</b>
                                </div>
                                <div className = "price text-medium-small">
                                    <b>Price</b>
                                </div>
                                <div className = "invested text-medium-small">
                                    <b>Invested</b>
                                </div>
                                <div className = "profit-loss text-medium-small">
                                    <b>P/L</b>
                                </div>
                                <div className = "text-medium-small">
                                    <b>Update</b>
                                </div>
                                <div className = "text-medium-small">
                                    <b>Delete</b>
                                </div>
                            </div>
                            {popUpData}
                        </div>
                    </div>
                </div>
                <div id = "updateModal" className = "modal" style = {this.state.updateModal}>
                <div className="modal-content">
                    <div className="modal-header-success">
                        <span className="close" onClick = {()=>this.closeUpdateModal()}>&times;</span>
                        <h2 className = "text-medium">Update</h2>
                    </div>
                    <div className="modal-body">
                        <div className = "center">
                            <form onSubmit = {this.submitUpdateForm}>
                                <input className = "decreaseInput" type="text" placeholder ="Enter Number Of Stocks" name = "qtyNumber" id = "qtyNumber"
                                onChange = {this.onChangeUpdatePrice}/>
                                <button type = "submit" className = "btn">Decrease</button>
                            </form>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}
