const express = require("express");

const userModel = require("./Models/User");
const productModel = require("./Models/Products");
// const supplierRoutes = require("../Routes/Supplier"); // ✅ add this line


const reviewModel = require("./Models/reviews");
const cartModel = require("./Models/Cart");
const supplierModel = require("./Models/Supplier");
const { signupValidation, loginValidation } = require("./Middleware/AuthValidation");
const cors = require("cors");
const bodyParser = require("body-parser");

const categoryModel = require("./Models/Category");


require("dotenv").config();
require("./Models/db");
const app = express();

app.use(bodyParser.json());
// app.use("/api/supplier", supplierRoutes); // ✅ add this line
app.use(cors());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.post("/demo", async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = await productModel.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// app.post("/login", loginValidation, async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // First, try to find in users collection
//     let user = await userModel.findOne({ email });

//     // If not found in users, try in suppliers
//     if (!user) {
//       user = await supplierModel.findOne({ email });
      
//       // If found in suppliers, add role information
//       if (user) {
//         user = user.toObject(); // Convert mongoose document to plain object
//         user.role = "supplier";
//       }
//     }

//     // If still not found
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Check password (plain text comparison - consider hashing passwords in future)
//     if (password !== user.password) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Send successful response
//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         name: user.name,
//         email: user.email,
//         role: user.role || "user",
//         address: user.address,
//         phno: user.phno
//       },
//       supplierEmail: user.role === "supplier" ? user.email : null
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// In your server index.js, add detailed logging:
app.post("/login", loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📧 Login attempt for:", email);
    console.log("🔑 Password received:", password);

    // First, try to find in users collection
    let user = await userModel.findOne({ email });
    console.log("👤 User found in users collection:", user ? "Yes" : "No");

    // If not found in users, try in suppliers
    if (!user) {
      user = await supplierModel.findOne({ email });
      console.log("🏭 Supplier found:", user ? "Yes" : "No");
      
      if (user) {
        // Convert mongoose document to plain object and add role
        user = user.toObject();
        user.role = "supplier";
        console.log("🔧 Converted supplier to object with role");
      }
    }

    // If still not found
    if (!user) {
      console.log("❌ User not found in any collection");
      return res.status(400).json({ message: "User not found" });
    }

    // Check password (plain text comparison)
    console.log("🔐 Comparing passwords:");
    console.log("   Input password:", password);
    console.log("   Stored password:", user.password);
    
    if (password !== user.password) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login successful for:", email, "Role:", user.role);

    // Send successful response
    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role || "user",
        address: user.address,
        phno: user.phno
      },
      supplierEmail: user.role === "supplier" ? user.email : null
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/demo", async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/review", async (req, res) => {
  try {
    const { email, review } = req.body;
    const newReview = await reviewModel.create({ email, review });
    res.status(200).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/review", async (req, res) => {
  try {
    const allReviews = await reviewModel.find();
    res.status(200).json(allReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const allproducts = await productModel.find();
    res.status(200).json(allproducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from request parameters

    let allProducts;
    if (query) {
      allProducts = await productModel.find({
        $or: [
          { productName: { $regex: query, $options: "i" } }, // Case-insensitive search
          { category: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      allProducts = await productModel.find();
    }

    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/cart", async (req, res) => {
  try {
    const { userEmail, products } = req.body;

    // Validate that all products have supplierEmail
    const productsMissingSupplier = products.filter(p => !p.supplierEmail);
    if (productsMissingSupplier.length > 0) {
      return res.status(400).json({ 
        message: "Some products are missing supplier information",
        products: productsMissingSupplier.map(p => p.productName)
      });
    }

    let cart = await cartModel.findOne({ userEmail });

    if (!cart) {
      cart = new cartModel({ userEmail, products });
    } else {
      products.forEach((newProduct) => {
        const existingProduct = cart.products.find(
          (p) => p.productName === newProduct.productName && p.supplierEmail === newProduct.supplierEmail
        );

        if (existingProduct) {
          existingProduct.quantity += newProduct.quantity;
        } else {
          cart.products.push(newProduct);
        }
      });
    }

    await cart.save();
    res.status(200).json({ message: "Products added/updated in cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/cart/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;
    const cart = await cartModel.findOne({ userEmail });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/cart/:email/:productName", async (req, res) => {
  const { email, productName } = req.params;

  try {
    // Find the user's cart
    const cart = await cartModel.findOne({ userEmail: email });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the product to be removed
    const updatedProducts = cart.products.filter(
      (product) => product.productName !== productName
    );

    // If no products are left, delete the cart entirely
    if (updatedProducts.length === 0) {
      await cartModel.deleteOne({ userEmail: email });
      return res.status(200).json({ message: "Cart emptied and deleted" });
    }

    // Otherwise, update the cart
    cart.products = updatedProducts;
    await cart.save();

    res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
});

app.put("/cart/:email/:productName", async (req, res) => {
  const { email, productName } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartModel.findOne({ userEmail: email });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const product = cart.products.find((p) => p.productName === productName);
    if (product) {
      product.quantity = quantity;
      await cart.save();
      return res.status(200).json({ message: "Quantity updated", cart });
    }

    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity", error });
  }
});

// Delete user by ID
app.delete("/demo/:id", async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product by ID
app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update Product (Bike) by ID
app.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/user/:email", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/cart/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const deleted = await cartModel.findOneAndDelete({ userEmail: email });

    if (!deleted) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart emptied successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ----------------------------------------------------------------------------




app.post("/supplier-register", signupValidation, async (req, res) => {
// app.post("/supplier-register", supplierValidation, async (req, res) => {
  try {
    const existingSupplier = await supplierModel.findOne({ email: req.body.email });
if (existingSupplier) {
  return res.status(400).json({ message: "Email already exists" });
}

const supplier = await supplierModel.create(req.body);


    res.status(200).json({ message: "Supplier registered successfully", supplier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Order routes
const orderModel = require("./Models/Order");

// Create order
app.post("/orders", async (req, res) => {
  try {
    const order = await orderModel.create(req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
app.get("/orders/:userEmail", async (req, res) => {
  try {
    const orders = await orderModel.find({ userEmail: req.params.userEmail }).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (for admin)
app.get("/orders", async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
app.put("/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get supplier orders
app.get("/supplier-orders/:supplierEmail", async (req, res) => {
  try {
    const orders = await orderModel.find({
      "products.supplierEmail": req.params.supplierEmail
    }).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get statistics for supplier dashboard
app.get("/supplier-stats/:supplierEmail", async (req, res) => {
  try {
    const supplierEmail = req.params.supplierEmail;
    
    // Count bikes
    const bikesCount = await productModel.countDocuments({ supplierEmail });
    
    // Count orders
    const ordersCount = await orderModel.countDocuments({
      "products.supplierEmail": supplierEmail
    });
    
    // Calculate total sales
    const orders = await orderModel.find({
      "products.supplierEmail": supplierEmail,
      paymentStatus: "completed"
    });
    
    let totalSales = 0;
    orders.forEach(order => {
      order.products.forEach(product => {
        if (product.supplierEmail === supplierEmail) {
          totalSales += product.price * product.quantity;
        }
      });
    });
    
    // Count pending orders
    const pendingOrders = await orderModel.countDocuments({
      "products.supplierEmail": supplierEmail,
      status: "pending"
    });
    
    res.status(200).json({
      bikesCount,
      ordersCount,
      totalSales,
      pendingOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Add this endpoint to your server (index.js)
app.get("/user/:email", async (req, res) => {
  try {
    // First try to find in users collection
    let user = await userModel.findOne({ email: req.params.email });
    
    // If not found in users, try in suppliers
    if (!user) {
      user = await supplierModel.findOne({ email: req.params.email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get supplier orders
app.get("/supplier-orders/:supplierEmail", async (req, res) => {
  try {
    const orders = await orderModel.find({
      "products.supplierEmail": req.params.supplierEmail
    }).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order
app.put("/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all suppliers
app.get("/supplier", async (req, res) => {
  try {
    const suppliers = await supplierModel.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete supplier
app.delete("/supplier/:id", async (req, res) => {
  try {
    const deletedSupplier = await supplierModel.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update supplier status
app.put("/supplier/:id", async (req, res) => {
  try {
    const updatedSupplier = await supplierModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status
app.put("/user/:id", async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//--------------------15/09/2025------------------


// Get all categories (accessible to all)
app.get("/categories", async (req, res) => {
  try {
    const categories = await categoryModel.find({ isActive: true });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all categories including inactive (admin only)
app.get("/categories/all", async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category (admin only)
app.post("/categories", async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    
    // Check if category already exists
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    
    const category = await categoryModel.create({ name, description, createdBy });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update category (admin only)
app.put("/categories/:id", async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { name, description, isActive },
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete category (admin only)
app.delete("/categories/:id", async (req, res) => {
  try {
    // Check if any products are using this category
    const productsWithCategory = await productModel.countDocuments({ category: req.params.id });
    if (productsWithCategory > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category. There are products associated with it." 
      });
    }
    
    const deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales by category (for reports)
app.get("/sales-by-category", async (req, res) => {
  try {
    const salesByCategory = await orderModel.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.productName",
          foreignField: "productName",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalSales: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: "$products.quantity" }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          categoryName: "$categoryDetails.name",
          totalSales: 1,
          totalOrders: 1,
          totalQuantity: 1
        }
      }
    ]);
    
    res.status(200).json(salesByCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get sales by category for a specific supplier
app.get("/supplier-sales-by-category/:supplierEmail", async (req, res) => {
  try {
    const { supplierEmail } = req.params;
    
    const salesByCategory = await orderModel.aggregate([
      { $unwind: "$products" },
      {
        $match: {
          "products.supplierEmail": supplierEmail
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productName",
          foreignField: "productName",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalSales: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: "$products.quantity" }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          categoryName: "$categoryDetails.name",
          totalSales: 1,
          totalOrders: 1,
          totalQuantity: 1
        }
      }
    ]);
    
    res.status(200).json(salesByCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});