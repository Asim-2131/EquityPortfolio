const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var quantitySchema = new Schema({
    numberOfStocks : {
        type : String,
        required : true,
    },
    priceOfStocks : {
        type : String,
        required:true,
    }
},{
    timestamps : true
})

module.exports = mongoose.model('Quantity',quantitySchema);