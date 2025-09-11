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
    type: String,
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
    required: true, // 👈 MUST be required so we can count properly
  },
});

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
