const mongoose=  require('mongoose');
const Schema = mongoose.Schema;

var stockSchema = new Schema({
    name :{
        type : String,
        required :true
    },
    companyCode : {
        type : String ,
        required : true
    }
},{
    timestamps : true
}
);
module.exports = mongoose.model('Stock',stockSchema);