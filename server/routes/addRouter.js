const express = require('express');
const User = require('../models/user');
const Watchlist = require('../models/watchlist');
const Quantity = require('../models/quantity');
const Company = require('../models/company')
const addRouter = express.Router();
const bodyParser = require('body-parser');
addRouter.use(bodyParser.json());


addRouter.route('/towatchlistdata')
            .post((req,res,next)=>{
                User.find({userId : req.body.userId})
                    .populate('watchlist')
                    .then(user=>{
                        var t = user[0];
                        var tt = new Watchlist({companyName : req.body.sName,companyCode : req.body.companyCode});
                        tt.save();
                        t.watchlist.push(tt);
                        t.save();
                        res.statusCode = 200;
                        res.send(t.watchlist);
                    },err=>next(err))
                    .catch(err=>next(err));
            })
addRouter.route('/addToPortfolio')
            .post((req,res,next)=>{
                User.find({userId : req.body.userId})
                    .populate({
                        path : 'companies',
                        populate:{
                            path : 'qty'
                        }
                    })
                    .then(user=>{
                        var t = user[0];
                        var qty_price_object = new Quantity({numberOfStocks:req.body.quantity,priceOfStocks:req.body.price});
                        qty_price_object.save();
                        var isOk = false;
                        for(var i=0;i<t.companies.length;i++){
                            if(t.companies[i].companyCode == req.body.companyCode){
                                isOk = true
                                t.companies[i].qty.push(qty_price_object);
                                t.companies[i].save();
                                t.save();
                                res.statusCode = 200;
                                res.send(t);
                                break;
                            }
                        }
                        if(!isOk){
                            var company_data = new Company ({companyName : req.body.companyName,companyCode : req.body.companyCode, qty : []});
                            company_data.qty.push(qty_price_object);
                            company_data.save();
                            t.companies.push(company_data);
                            t.save();
                            res.statusCode = 200;
                            res.send(t);
                        }
                    })
            })
addRouter.route('/deleteStock')
            .post((req,res,next)=>{
                Watchlist.find({companyName : req.body.companyName})
                    .then(companyData=>{
                        var oId = String(companyData[0]._id);
                        User.find({userId : req.body.userId})
                            .then(user=>{
                                var refw = [];
                                for(var i=0;i<user[0].watchlist.length;i++){
                                    if(oId == user[0].watchlist[i]) continue;
                                    else refw.push(user[0].watchlist[i]);
                                }
                                user[0].watchlist = refw;
                                user[0].save();
                            })
                        companyData[0].remove({companyName : req.body.companyName});
                        res.statusCode = 200;
                        res.send("Complete");
                    })
                
            });

addRouter.route('/deletePStock')
            .post((req,res,next)=>{
                User.findOne({userId : req.body.userId})
                    .then(user=>{
                        var ref = [];
                        console.log(user);
                        for(var i=0;i<user.companies.length;i++){
                            if(i == req.body.selectedCompanyId){
                                referenceId = String(user.companies[i]);
                                Company.findOne({_id : String(user.companies[i])})
                                    .then(company=>{
                                        for(var j=0;j<company.qty.length;j++){
                                            Quantity.findOneAndRemove({_id : String(company.qty[j])})
                                                .then(qty=>{})
                                        }
                                    })
                                Company.findOneAndRemove({_id : String(user.companies[i])})
                                .then(company=>{});
                            }
                            else{
                                ref.push(String(user.companies[i]));
                            }
                        }
                        user.companies  = ref;
                        user.save();
                    });

                User.findOne({userId : req.body.userId})
                    .populate({
                        path : 'companies',
                        populate:{
                            path : 'qty'
                        }
                    })
                    .then(user=>{
                        res.statusCode = 200;
                        res.send(user);
                    })
            })
addRouter.route('/deleteQty')
            .post((req,res,next)=>{
                User.findOne({userId : req.body.userId})
                    .then(user=>{
                        for(var i=0;i<user.companies.length;i++){
                            if(i == req.body.selectedCompanyId){
                                
                                Company.findOne({_id : String(user.companies[i])})
                                    .then(company=>{
                                        var ref = [];
                                        for(var j=0;j<company.qty.length;j++){
                                            if(j == req.body.qtyId){
                                                Quantity.findOneAndRemove({_id : String(company.qty[j])})
                                                    .then(qty=>{
                                                        
                                                    });
                                            }
                                            else ref.push(String(company.qty[j]))
                                        }
                                        company.qty = ref;
                                        company.save();
                                        console.log("successfully qty deleted");
                                        res.statusCode = 200;
                                        res.send("Complete");
                                    })
                                
                            }
                        }
                        
                    })
            })
addRouter.route('/updateQty')
            .post((req,res,next)=>{
                User.find({userId : req.body.userId})
                    .then(user=>{
                        var ref = user[0];
                        console.log(ref);
                        for(var i=0;i<ref.companies.length;i++){
                            if(i == req.body.companyId){
                                Company.findOne({_id : String(ref.companies[i])})
                                    .then(company=>{
                                        console.log(company);
                                        console.log(company);
                                        for(var j=0;j<company.qty.length;j++){
                                            if(j == req.body.qtyId){
                                            
                                                Quantity.findOne({_id : String(company.qty[j])})
                                                .then(qty=>{
                                                    console.log(qty);
                                                    qty.numberOfStocks = Number(qty.numberOfStocks) - Number(req.body.decreaseQty);
                                                    qty.save();
                                                    res.statusCode = 200;
                                                    res.send('complete');
                                                    next();
                                                })
                                                break;
                                            }
                                        }
                                    })
                                    break;
                            }
                        }
                    })
            })
module.exports = addRouter;