import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({
    name: "",
    phno: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [email, setEmail] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const formatRupees = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (email) {
      // Use the endpoint you just added
      axios
        .get(`http://localhost:3000/user/${email}`)
        .then((res) => {
          setUser(res.data);
          setAddress(res.data.address || "");
        })
        .catch((err) => console.error("Failed to fetch user:", err));

      axios
        .get(`http://localhost:3000/cart/${email}`)
        .then((res) => {
          const items = res.data.products;
          setCartItems(items);
          const calculatedTotal = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );
          setTotal(calculatedTotal);
        })
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [email]);

  const createOrder = async () => {
    try {
      // Validate required fields
      if (!email || !address || cartItems.length === 0) {
        throw new Error("Missing required order information");
      }

      const orderData = {
        userEmail: email,
        products: cartItems.map(item => ({
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          imgURL: item.imgURL,
          supplierEmail: item.supplierEmail || "bakul@gmail.com"
        })),
        totalAmount: total * 0.9 + 5799,
        address: address,
        paymentMethod: paymentMethod,
        paymentStatus: "completed",
        status: "pending"
      };
      
      console.log("Submitting order:", orderData);
      
      const response = await axios.post("http://localhost:3000/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="bg-cream2 min-h-screen py-10 px-4 md:px-16 flex items-center flex-col lg:flex-row gap-8">
        {/* Left Section - Checkout Form */}
        <div className="admindiv animate-move-out custom-shadow w-full lg:w-1/2 p-8 rounded-2xl shadow-md space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Checkout
          </h2>

          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-4">
              Delivery Address
            </h3>
            <div className="space-y-3">
              <input
                value={user.name}
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border border-gray-300 cursor-not-allowed bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
              <input
                value={user.phno}
                type="text"
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 cursor-not-allowed bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="w-full p-3 border border-gray-300 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="3"
                required
              />
              <input
                value={email}
                readOnly
                type="email"
                className="w-full p-3 border border-gray-300 bg-gray-100 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-4">
              Payment Method
            </h3>
            <div className="space-y-3">
              {[
                {
                  method: "cod",
                  label: "Cash on Delivery",
                  icon: "/src/photos/cash.png",
                },
              ].map(({ method, label, icon }) => (
                <label
                  key={method}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                    paymentMethod === method
                      ? "bg-blue-500 text-white shadow"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => setPaymentMethod(method)}
                >
                  <img src={icon} alt={label} className="w-6 h-6 mr-3" />
                  <span className="font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (!address) {
                toast.error("Please enter your delivery address");
                return;
              }
              if (cartItems.length === 0) {
                toast.error("Your cart is empty");
                return;
              }
              setShowModal(true);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl text-lg font-semibold transition"
          >
            Place Order
          </button>
        </div>

        {/* Right Section - Order Summary */}
        <div className="admindiv animate-move-in custom-shadow w-full h-fit lg:w-5/6 p-8 py-10 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <div className="divide-y divide-gray-200 mb-6">
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-2 text-gray-100"
                  >
                    <span>
                      {item.productName} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatRupees(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mt-14 text-gray-100">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatRupees(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount (10%)</span>
                  <span className="text-green-300">
                    - {formatRupees(total * 0.1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{formatRupees(5799)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span>Grand Total</span>
                  <span className="text-2xl">
                    {formatRupees(total * 0.9 + 5799)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 animate-fade-in rounded-xl shadow-lg relative w-full max-w-md text-center">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-black font-bold"
              >
                &times;
              </button>

              <p className="text-lg font-medium text-gray-700 mb-4">
                Confirm your order?
              </p>

              <button
                onClick={async () => {
                  try {
                    // Create order
                    await createOrder();
                    
                    // Delete cart from backend
                    await axios.delete(`http://localhost:3000/cart/${email}`);

                    toast.success("Order placed successfully! Will be delivered within 2 business days.");
                    
                    // Navigate to order history
                    navigate("/order-history");
                  } catch (error) {
                    console.error("Failed to place order:", error);
                    toast.error("Failed to process order. Try again!");
                  }
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Confirm Order
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}