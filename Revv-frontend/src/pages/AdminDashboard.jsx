import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/Nav";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, suppliersRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:3000/user"),
        axios.get("http://localhost:3000/supplier"),
        axios.get("http://localhost:3000/orders")
      ]);
      
      setUsers(usersRes.data);
      setSuppliers(suppliersRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleUserStatus = async (email, currentStatus) => {
    try {
      await axios.put(`http://localhost:3000/user/${email}`, {
        isActive: !currentStatus
      });
      fetchData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const toggleSupplierStatus = async (email, currentStatus) => {
    try {
      await axios.put(`http://localhost:3000/supplier/${email}`, {
        isActive: !currentStatus
      });
      fetchData();
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <Nav />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Suppliers</h3>
            <p className="text-3xl font-bold text-green-600">{suppliers.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-purple-600">{orders.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Users Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left">Name</th>
                    <th className="text-left">Email</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`px-2 py-1 rounded ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleUserStatus(user.email, user.isActive)}
                          className={`px-3 py-1 rounded ${user.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Suppliers Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Suppliers Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left">Name</th>
                    <th className="text-left">Email</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(supplier => (
                    <tr key={supplier._id}>
                      <td>{supplier.name}</td>
                      <td>{supplier.email}</td>
                      <td>
                        <span className={`px-2 py-1 rounded ${supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {supplier.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleSupplierStatus(supplier.email, supplier.isActive)}
                          className={`px-3 py-1 rounded ${supplier.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                        >
                          {supplier.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}