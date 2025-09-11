import React, { useEffect, useState } from "react";
import SupplierNavbar from "./SupplierNavbar";
import { useNavigate } from "react-router-dom";

const SupplierDashboard = () => {
  const [supplierEmail] = useState(localStorage.getItem("email") || "");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/");
  };

  const [supplierName, setSupplierName] = useState("");
  const [stats, setStats] = useState({
    bikesCount: 0,
    ordersCount: 0,
    totalSales: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch supplier info
        const supplierRes = await fetch(`http://localhost:3000/user/${supplierEmail}`);
        if (supplierRes.ok) {
          const supplierData = await supplierRes.json();
          setSupplierName(supplierData.name || "");
        }

        // Fetch stats from your backend API
        const statsRes = await fetch(`http://localhost:3000/supplier-stats/${supplierEmail}`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({
            bikesCount: statsData.bikesCount || 0,
            ordersCount: statsData.ordersCount || 0,
            totalSales: statsData.totalSales || 0,
            pendingOrders: statsData.pendingOrders || 0
          });
        } else {
          console.error("Failed to fetch stats");
        }
      } catch (err) {
        console.error("Failed to fetch supplier dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (supplierEmail) {
      fetchDashboardData();
    }
  }, [supplierEmail]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <>
      <SupplierNavbar supplierName={supplierName} onLogout={onLogout} />

      <div className="bg-gradient-to-r from-yellow-400 to-blue-700 text-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mt-6 text-center">
        <h2 className="text-3xl font-semibold mb-2">Welcome, {supplierName} 👋</h2>
        <p className="text-lg">Manage your bikes, view orders, and track your sales in one place.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-blue-700 hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-600 text-lg mb-2">My Bikes</h3>
          <p className="text-blue-700 font-bold text-3xl">{stats.bikesCount}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-green-500 hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-600 text-lg mb-2">Total Orders</h3>
          <p className="text-green-500 font-bold text-3xl">{stats.ordersCount}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-purple-500 hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-600 text-lg mb-2">Total Sales</h3>
          <p className="text-purple-500 font-bold text-3xl">₹{stats.totalSales.toLocaleString("en-IN")}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-yellow-500 hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-600 text-lg mb-2">Pending Orders</h3>
          <p className="text-yellow-500 font-bold text-3xl">{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate("/supplier/manage-bikes")}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Manage Bikes
            </button>
            <button 
              onClick={() => navigate("/supplier/orders")}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplierDashboard;