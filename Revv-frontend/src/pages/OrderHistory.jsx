import { useEffect, useState } from "react";
import Nav from "../components/Nav";

export default function OrderHistory() {
  const [email, setEmail] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      fetchOrders(storedEmail);
    }
  }, []);

  const fetchOrders = async (userEmail) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${userEmail}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'shipped': return 'text-blue-600';
      case 'processing': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <Nav />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Order History</h1>
        
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Placed</p>
                    <p className="font-semibold">{formatDate(order.orderDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Total</p>
                    <p className="font-semibold">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Products:</h3>
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span>{product.productName} x {product.quantity}</span>
                      <span>₹{(product.price * product.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm"><span className="font-semibold">Delivery Address:</span> {order.address}</p>
                  <p className="text-sm"><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}