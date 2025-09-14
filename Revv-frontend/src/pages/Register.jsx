import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterPage() {
  //the states
  const [name, setName] = useState("");
  const [phno, setPhno] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();
  
  //handle the register button
  async function handleClick(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          phno,
          address,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      toast.success("User created successfully!");

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create user. Please try again.");
    }
  }

  //the return code
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
          <p className="text-yellow-200 mt-1">Create your account</p>
        </div>

        {/* Registration Form */}
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h2>
          
          <form onSubmit={handleClick}>
            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your full name"
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
                value={phno}
                onChange={(e) => setPhno(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Address Input */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your delivery address"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              Login to Your Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 py-4 px-6 text-center">
          <p className="text-xs text-gray-600">
            By creating an account, you agree to BikeVerse's <br />
            <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> and{" "}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}