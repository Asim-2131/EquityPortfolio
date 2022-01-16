const path = require('path');
const express = require('express');
const stockRouter = require('./routes/stockRouter');
const userRouter = require('./routes/userRouter');
const addRouter = require('./routes/addRouter')
const fetchRouter = require('./routes/fetchRouter');

const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

url = "mongodb://localhost:27017/StockMarketDB";
const connect = mongoose.connect(url,{
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true,
    useFindAndModify : false
});

connect.then(db=>{
    console.log('Connected To MongoDB correctly');
},(err)=>{console.log(err);})

const app = express();

const buildPath = path.join(__dirname,'..','build');
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(buildPath));
app.use(cors());
app.use('/fdata',stockRouter);
app.use('/authenticate',userRouter);
app.use('/add',addRouter);
app.use('/fetch',fetchRouter);

app.listen(3443,()=>{
    console.log('server statrt on port 3443');
})