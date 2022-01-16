const express = require('express');
const Stock = require('../models/stock');
const stockRouter = express.Router();


stockRouter.route('/')
            .get((req,res,next)=>{
                Stock.find({})
                    .then(stocks =>{
                        res.statusCode = 200;
                        res.send(stocks);
                    },(err)=>next(err))
                    .catch((err)=>next(err));
            })

module.exports = stockRouter;