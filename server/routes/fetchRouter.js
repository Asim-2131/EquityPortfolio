const express = require('express');
const User = require('../models/user');
const fetchRouter = express.Router();
const bodyParser = require('body-parser');
fetchRouter.use(bodyParser.json());
const axios = require('axios');


fetchRouter.route('/watchlistdata')
            .post((req,res,next)=>{
                User.find({userId : req.body.userId})
                        .populate('watchlist')
                        .then(user=>{
                            var t = user[0];
                            res.statusCode = 200;
                            res.send(t.watchlist);
                        },err=>next(err))
                        .catch(err=>next(err))
            })
fetchRouter.route('/portfolio')
            .post((req,res,next)=>{
                User.find({userId : req.body.userId})
                        .populate({
                            path : 'companies',
                            populate:{
                                path : 'qty'
                            }
                        })
                        .then(user=>{
                            res.statusCode = 200;
                            res.send(user[0].companies);
                        },err=>next(err))
                        .catch(err=>next(err))
            })
module.exports = fetchRouter;