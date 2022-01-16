
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
        required : true,
    },
    userId : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required:true,
    },
    companies : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
    }],
    watchlist : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Watchlist'
    }]
},{
    timestamps : true
})

module.exports = mongoose.model('User',userSchema);