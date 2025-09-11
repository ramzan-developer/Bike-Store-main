const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phno: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "supplier" }
});

module.exports = mongoose.model("suppliers", supplierSchema);
