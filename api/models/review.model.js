const {model, Schema } = require('mongoose');
const modelConfig = require("@/config");

const Review = model('Review', new Schema({
    comment:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    productId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Product'
    }

    }, modelConfig ));
    
module.exports= Review;