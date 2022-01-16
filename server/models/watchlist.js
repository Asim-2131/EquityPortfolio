const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var watchlistSchema = new Schema({
    companyName : {
        type : String,
        required:true
    },
    companyCode : {
        type : String,
        required:true,
    },
},{
    timestamps : true
})

module.exports = mongoose.model('Watchlist',watchlistSchema);