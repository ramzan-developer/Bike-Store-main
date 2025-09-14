import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SupplierRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phno: "",
    address: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/supplier-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Supplier registered successfully!");
        navigate("/login"); // redirect to login page
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      {/* Register Container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 py-4 px-6 text-center">
          <h1 className="text-2xl font-bold text-white">
            Bike<span className="text-yellow-400">Verse</span>
            <span className="ml-1" role="img" aria-label="bicycle">🚴</span>
          </h1>
          <p className="text-yellow-200 mt-1">Supplier Registration</p>
        </div>

        {/* Registration Form */}
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Supplier Sign Up</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your business name"
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Business Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your business email"
                required
              />
            </div>

            {/* Phone Number Input */}
            <div className="mb-4">
              <label htmlFor="phno" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phno"
                type="text"
                name="phno"
                value={formData.phno}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your business phone number"
                required
              />
            </div>

            {/* Address Input */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your business address"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Create Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Create a secure password"
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform"
            >
              Register as Supplier
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Alternative Registration Options */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Looking for a different account type?</p>
            <div className="flex flex-col gap-3">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Register as Customer
              </Link>
              <Link
                to="/login"
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 py-4 px-6 text-center">
          <p className="text-xs text-gray-600">
            By registering as a supplier, you agree to BikeVerse's <br />
            <p className="text-blue-600">Terms of Service <span className="text-gray-600">and </span>Supplier Agreement</p>
          </p>
        </div>
      </div>
    </div>
  );
}