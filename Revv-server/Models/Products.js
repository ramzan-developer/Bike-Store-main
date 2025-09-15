const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgURL: {
    type: String,
    required: true,
  },
  supplierEmail: {
    type: String,
    required: true,
  },
});

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
