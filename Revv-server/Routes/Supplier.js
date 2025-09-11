const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


// Route: GET /api/supplier/:supplierEmail/bikes/count
router.get("/:supplierEmail/bikes/count", async (req, res) => {
  try {
    const supplierEmail = req.params.supplierEmail;
    const count = await Product.countDocuments({ supplierEmail });
    res.json({ count });
  } catch (err) {
    console.error("Error getting bikes count:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
