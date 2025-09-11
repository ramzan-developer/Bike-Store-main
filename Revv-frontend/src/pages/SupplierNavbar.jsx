// SupplierNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const SupplierNavbar = ({ supplierName, onLogout }) => {
  return (
    <header className="bg-blue-800 text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-md">
      <h1 className="text-xl font-bold mb-2 md:mb-0">Supplier Panel — {supplierName}</h1>
      <nav className="flex flex-wrap gap-4 items-center text-sm">
        <Link to="/supplier/dashboard" className="hover:text-yellow-300 transition">
          Dashboard
        </Link>
        <Link to="/supplier/manage-bikes" className="hover:text-yellow-300 transition">
          Manage Bikes
        </Link>
        <Link to="/supplier/orders" className="hover:text-yellow-300 transition">
          My Orders
        </Link>
        <Link to="/supplier/bills" className="hover:text-yellow-300 transition">
          Bills
        </Link>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default SupplierNavbar;
