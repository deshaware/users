const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();

require('./db/mongo');

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:false
}));

app.get('/',(req,res)=>res.send(`Server is up and running`));

//routes
const user = require('./routes/api/admin');
app.use('/api/admin',user);


const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`Listening at ${port}`));