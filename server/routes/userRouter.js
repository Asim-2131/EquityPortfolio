const express = require('express');
const User = require('../models/user');
const userRouter = express.Router();
const bodyParser = require('body-parser');
userRouter.use(bodyParser.json());


userRouter.route('/login')
                .post((req,res,next)=>{
                    User.find({userId : req.body.username,password : req.body.password})
                        .then(user=>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            console.log(user);
                            if(!user || !user.length){
                                res.send({isOk : false});
                            }
                            else{
                                res.send({isOk  : true})
                            }
                        },(err)=>next(err)).catch((err)=>next(err))
                })
userRouter.route('/signup')
                .post((req,res,next)=>{
                    User.find({userId : req.body.username})
                        .then(user=>{
                            if(user.length != 0){
                                res.statusCode = 200;
                                res.send({
                                    isOk : false,
                                    message : "User Already Exists Please Login"
                                })
                            }
                            else{
                                var newUser = new User({
                                    firstName : req.body.firstname,
                                    lastName : req.body.lastname,
                                    userId : req.body.username,
                                    password : req.body.password,
                                    companies : [],
                                    watchlist:[]
                                })
                                newUser.save();
                                res.statusCode = 200;
                                res.send({
                                    isOk : true,
                                    message : "Successfully Created Account"
                                })
                            }
                        })
                })

module.exports = userRouter;