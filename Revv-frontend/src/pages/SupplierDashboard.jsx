import React, { useEffect, useState } from "react";
import SupplierNavbar from "./SupplierNavbar";

import { useNavigate } from "react-router-dom";

const SupplierDashboard = () => {
  const [supplierEmail] = useState(localStorage.getItem("supplierEmail") || "");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("supplierEmail");
    navigate("/");
  };

  const [supplierName, setSupplierName] = useState("");
  const [stats, setStats] = useState({
    bikesCount: 0,
    ordersCount: 0,
    totalBills: 0,
    pendingBills: 0,
  });
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch supplier info
        const supplierRes = await fetch(`/api/supplier/${supplierEmail}`);
        const supplierData = await supplierRes.json();
        setSupplierName(supplierData.name || "");

        // Fetch stats — adjust these endpoints per your backend API
        const bikesRes = await fetch(`/api/supplier/${supplierEmail}/bikes/count`);
        const bikesCount = (await bikesRes.json()).count || 0;

        const ordersRes = await fetch(`/api/supplier/${supplierEmail}/orders/count`);
        const ordersCount = (await ordersRes.json()).count || 0;

        const billsRes = await fetch(`/api/supplier/${supplierEmail}/bills/summary`);
        const billsData = await billsRes.json();

        setStats({
          bikesCount,
          ordersCount,
          totalBills: billsData.total || 0,
          pendingBills: billsData.pending || 0,
        });
      } catch (err) {
        console.error("Failed to fetch supplier dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [supplierEmail]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <>
      <SupplierNavbar supplierName={supplierName} onLogout={onLogout} />

      <div className="bg-gradient-to-r from-yellow-400 to-blue-700 text-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mt-6 text-center">
        <h2 className="text-3xl font-semibold mb-2">Welcome, {supplierName} 👋</h2>
        <p className="text-lg">Manage your bikes, view orders, and track your bills in one place.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-blue-700 hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-600 text-lg mb-2">My Bikes</h3>
          <p className="text-blue-700 font-bold text-3xl">{stats.bikesCount}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-blue-700 hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-600 text-lg mb-2">Orders (with my bikes)</h3>
          <p className="text-yellow-400 font-bold text-3xl">{stats.ordersCount}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-blue-700 hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-600 text-lg mb-2">Total Billed</h3>
          <p className="text-blue-700 font-bold text-3xl">₹ {stats.totalBills.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-blue-700 hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-gray-600 text-lg mb-2">Pending Bills</h3>
          <p className="text-yellow-400 font-bold text-3xl">{stats.pendingBills}</p>
        </div>
      </div>
    </>
  );
};

export default SupplierDashboard;
