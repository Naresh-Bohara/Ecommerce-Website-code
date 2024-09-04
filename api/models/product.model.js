const { model, Schema } = require('mongoose');
const modelConfig = require("@/config");


const Product = model('Product', new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
        default:0
    },
    images: {
        type:[String],
        required:true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'Category'
    },
    brandId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'Brand'
    },
    status: {
        type: Boolean,
        default: true,
    },
    featured: {
        type: Boolean,
        default: false,
    }
}, modelConfig));

module.exports = Product;
