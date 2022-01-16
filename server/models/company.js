const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var companySchema = new Schema({
    companyName : {
        type : String,
        required : true,
    },
    companyCode : {
        type : String,
        required:true,
    },
    qty : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Quantity'
    }]
},{
    timestamps : true
})

module.exports = mongoose.model('Company',companySchema);