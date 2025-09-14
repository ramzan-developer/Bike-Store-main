import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplierNavbar from "./SupplierNavbar";

const SupplierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supplierEmail, setSupplierEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      navigate("/");
      return;
    }
    setSupplierEmail(email);
    fetchOrders(email);
  }, [navigate]);

  const fetchOrders = async (email) => {
    try {
      const response = await fetch(`http://localhost:3000/supplier-orders/${email}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Order status updated");
        fetchOrders(supplierEmail); // Refresh orders
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order status");
    }
  };

  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (response.ok) {
        toast.success("Payment status updated");
        fetchOrders(supplierEmail); // Refresh orders
      }
    } catch (error) {
      console.error("Failed to update payment:", error);
      toast.error("Failed to update payment status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <SupplierNavbar 
        supplierName={localStorage.getItem("userName") || "Supplier"} 
        onLogout={() => {
          localStorage.removeItem("email");
          localStorage.removeItem("role");
          navigate("/");
        }} 
      />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Order Management</h1>
          <button
            onClick={() => navigate("/supplier/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ← Back to Dashboard
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">Placed on: {formatDate(order.orderDate)}</p>
                    <p className="text-sm">Customer: {order.userEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                    <p className="text-sm">Payment: {order.paymentMethod}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Products:</h4>
                  {order.products
                    .filter(product => product.supplierEmail === supplierEmail)
                    .map((product, index) => (
                      <div key={index} className="flex justify-between py-1">
                        <span>{product.productName} × {product.quantity}</span>
                        <span>₹{(product.price * product.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))
                  }
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Order Status</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Status</label>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm"><strong>Delivery Address:</strong> {order.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierOrders;