const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const promotionSchema = new Schema({ //Schema : định nghĩa đối tượng lưu trữ trong DB
    name: {
        type : String,
        required : true,
        unique : true
        // type là string, required : bắt buộc điền, unique : không được trùng
    },
    description: {
        type : String,
        required : true
    },
    image: {
        type : String,
        required : true
    },
    category: {
        type : String,
        required : true
    },
    label: {
        type : String,
        default : ''
    },
    price: {
        type : Currency,
        required : true,
        min : 0
    },
    feature: {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
     //timestamps : lệnh cho phép tự động thêm các trường createdAt và updatedAt vào
});

var promotions = mongoose.model('Promotion', promotionSchema);
module.exports = promotions;