import { useState, useEffect } from "react";
import { PackagePlus, Users, Boxes, ShoppingCart, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedItem, setSelectedItem] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        usersRes, 
        suppliersRes, 
        productsRes, 
        ordersRes, 
        reviewsRes
      ] = await Promise.all([
        axios.get(`${BASE_URL}/demo`),
        axios.get(`${BASE_URL}/supplier`),
        axios.get(`${BASE_URL}/products`),
        axios.get(`${BASE_URL}/orders`),
        axios.get(`${BASE_URL}/review`)
      ]);
      
      setUsers(usersRes.data);
      setSuppliers(suppliersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setReviews(reviewsRes.data);

      // Calculate statistics
      const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalAmount, 0);
      
      setStats({
        totalUsers: usersRes.data.length,
        totalSuppliers: suppliersRes.data.length,
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalRevenue: totalRevenue
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${BASE_URL}/demo/${id}`);
      setUsers(users.filter(user => user._id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await axios.delete(`${BASE_URL}/supplier/${id}`);
      setSuppliers(suppliers.filter(supplier => supplier._id !== id));
      toast.success("Supplier deleted successfully");
    } catch (error) {
      toast.error("Failed to delete supplier");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${BASE_URL}/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`${BASE_URL}/orders/${id}`);
      setOrders(orders.filter(order => order._id !== id));
      toast.success("Order deleted successfully");
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`${BASE_URL}/review/${id}`);
      setReviews(reviews.filter(review => review._id !== id));
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    try {
      await axios.put(`${BASE_URL}/user/${userId}`, { isActive });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive } : user
      ));
      toast.success("User status updated");
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const updateSupplierStatus = async (supplierId, isActive) => {
    try {
      await axios.put(`${BASE_URL}/supplier/${supplierId}`, { isActive });
      setSuppliers(suppliers.map(supplier => 
        supplier._id === supplierId ? { ...supplier, isActive } : supplier
      ));
      toast.success("Supplier status updated");
    } catch (error) {
      toast.error("Failed to update supplier status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[
          { label: "Dashboard", value: "dashboard", icon: <Settings size={18} /> },
          { label: "Users", value: "users", icon: <Users size={18} /> },
          { label: "Suppliers", value: "suppliers", icon: <Users size={18} /> },
          { label: "Products", value: "products", icon: <PackagePlus size={18} /> },
          { label: "Orders", value: "orders", icon: <ShoppingCart size={18} /> },
          { label: "Reviews", value: "reviews", icon: <Boxes size={18} /> },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveSection(tab.value)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-200 ${
              activeSection === tab.value
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-100"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        
        {/* <button
          onClick={() => navigate("/homepage")}
          className="flex items-center gap-2 px-5 py-2 rounded-full font-medium bg-green-600 text-white hover:bg-green-700"
        >
          🏠 Home
        </button> */}
      </div>

      {/* Dashboard Stats */}
      {activeSection === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Suppliers</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalSuppliers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
            <p className="text-3xl font-bold text-red-600">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
          </div>
        </div>
      )}

      {/* Users Section */}
      {activeSection === "users" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phno}</td>
                    <td className="p-3 capitalize">{user.role || "user"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => updateUserStatus(user._id, !user.isActive)}
                        className={`px-3 py-1 rounded ${user.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suppliers Section */}
      {activeSection === "suppliers" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Supplier Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(supplier => (
                  <tr key={supplier._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{supplier.name}</td>
                    <td className="p-3">{supplier.email}</td>
                    <td className="p-3">{supplier.phno}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded ${supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {supplier.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => updateSupplierStatus(supplier._id, !supplier.isActive)}
                        className={`px-3 py-1 rounded ${supplier.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                      >
                        {supplier.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Section */}
      {activeSection === "products" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Product Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img src={product.imgURL} alt={product.productName} className="h-16 w-16 object-cover rounded" />
                    </td>
                    <td className="p-3 font-medium">{product.productName}</td>
                    <td className="p-3">₹{product.rate.toLocaleString("en-IN")}</td>
                    <td className="p-3 capitalize">{product.category}</td>
                    <td className="p-3">{product.supplierEmail}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Section */}
      {activeSection === "orders" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Order Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">#{order._id.slice(-6)}</td>
                    <td className="p-3">{order.userEmail}</td>
                    <td className="p-3">₹{order.totalAmount.toLocaleString("en-IN")}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="p-1 border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 capitalize">{order.paymentStatus}</td>
                    <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {activeSection === "reviews" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Review Management</h2>
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <p className="text-gray-700">{review.review}</p>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">- {review.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;