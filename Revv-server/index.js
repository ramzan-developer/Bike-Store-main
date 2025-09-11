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
// const supplierRoutes = require('./Routes/supplier');

// app.use('/api/supplier', supplierRoutes); // 👈 this matches your frontend call


// import SupplierRegister from "./pages/SupplierRegister";
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
//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     if (password !== user.password) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         name: user.name,
//         email: user.email,
//         role: user.role, // <-- Include this
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
app.post("/login", loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    // First, try to find in users collection
    let user = await userModel.findOne({ email });

    // If not found in users, try in suppliers
    if (!user) {
      user = await supplierModel.findOne({ email });
    }

    // If still not found
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Send successful response
    // res.status(200).json({
    //   message: "Login successful",
    //   user: {
    //     name: user.name,
    //     email: user.email,
    //     role: user.role || "user", // fallback to 'user' if role is not set
    //   },
    // });
    res.status(200).json({
    message: "Login successful",
    user: {
    name: user.name,
    email: user.email,
    role: user.role || "user",
  },
  supplierEmail: user.role === "supplier" ? user.email : null
});


  } catch (error) {
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

    let cart = await cartModel.findOne({ userEmail });

    if (!cart) {
      cart = new cartModel({ userEmail, products });
    } else {
      products.forEach((newProduct) => {
        const existingProduct = cart.products.find(
          (p) => p.productName === newProduct.productName
        );

        if (existingProduct) {
          existingProduct.quantity += newProduct.quantity; // Increase quantity if product exists
        } else {
          cart.products.push(newProduct); // Add new product if not in cart
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