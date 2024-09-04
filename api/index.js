require('module-alias/register');

const express = require('express');
const router = require('@/routes');
const mongoose = require('mongoose');
const {config} = require('dotenv');
const cors = require('cors')

config();
 
const app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use((req, res, next)=>{
    return next({
        message:'Page Not Found',
        status:404
    })
})

app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.send({
        message:err.message || 'Server Error',
        errors:err.errors 
    })
})


app.listen(process.env.PORT_ADDR, async()=>{
    console.log(`Server started on http://localhost:${process.env.PORT_ADDR}`)
    console.log('Press Ctrl + C to stop the server...')
    await mongoose.connect(process.env.MONGO_URL)
    console.log('MongoDB Connected Seccessfully'); 

})