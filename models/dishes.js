const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  });

const dishSchema = new Schema(
  {
    //Schema : định nghĩa đối tượng lưu trữ trong DB
    name: {
      type: String,
      required: true,
      unique: true,
      // type là string, required : bắt buộc điền, unique : không được trùng
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    price: {
      type: Currency,
      required: true,
      min: 0,
    },
    feature: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
    //timestamps : lệnh cho phép tự động thêm các trường createdAt và updatedAt vào
  }
);

var Dishes = mongoose.model("Dish", dishSchema);
module.exports = Dishes;
