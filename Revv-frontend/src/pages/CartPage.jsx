import CartItems from "../components/CartItems";
import CheckoutButton from "../components/CheckoutButton";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CartPage() {
  const [email, setEmail] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      fetchCartData(storedEmail);
    } else {
      toast.error("Please log in to view your cart");
      navigate("/");
    }
  }, []);

  // Fetch cart data from backend
  const fetchCartData = async (userEmail) => {
    try {
      const response = await fetch(`http://localhost:3000/cart/${userEmail}`);
      if (response.status === 404) {
        // Cart doesn't exist yet, which is fine
        setProducts([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      
      const cartData = await response.json();
      setProducts(cartData.products || []);
    } catch (error) {
      console.error("Error fetching cart:", error.message);
      toast.error("Failed to load cart");
    }
  };

  // Update product quantity in the cart
  const handleQuantityChange = async (productName, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity becomes 0, remove the product
      removeFromCart(productName);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/cart/${email}/${productName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      // Update state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productName === productName ? { ...product, quantity: newQuantity } : product
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error.message);
      toast.error("Failed to update quantity");
    }
  };

  // Remove product from cart
  const removeFromCart = async (productName) => {
    try {
      const response = await fetch(`http://localhost:3000/cart/${email}/${productName}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productName !== productName)
      );
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error.message);
      toast.error("Failed to remove item");
    }
  };

  const withoutDiscount = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const total = (90 / 100) * withoutDiscount;
  const formattedTotal = total.toLocaleString("en-IN");

  return (
    <div className="bg-cream min-h-screen">
      <Nav cartCount={products.length} />
      <div className="min-h-166 p-5">
        {products.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart first</p>
            <Link 
              to="/homepage" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid">
            {products.map((product, index) => (
              <div className="justify-items-center" key={index}>
                <CartItems
                  productname={product.productName}
                  imgURL={product.imgURL}
                  price={product.price}
                  quantity={product.quantity}
                  onRemove={removeFromCart}
                  onQuantityChange={handleQuantityChange} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Footer - Only show if cart has items */}
      {products.length > 0 && (
        <div className="custom-shadow sticky h-30 bottom-0 bg-cream z-50 p-4">
          <div className="flex justify-center h-full items-center">
            <div className="font-bold mr-20 text-4xl">
              Total: <span>₹{formattedTotal}</span>
            </div>
            <Link className="cursor-pointer" to="/checkout">
              <CheckoutButton />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}