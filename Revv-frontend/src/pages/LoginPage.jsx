import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle the login button
  async function handleClick(e) {
    e.preventDefault();

    // Admin login check
    if (email === "you@gmail.com" && password === "1234") {
      toast.success("Admin Login Successful!");
      localStorage.setItem("email", email);
      localStorage.setItem("role", "admin");
      navigate("/admindashboard");
      return;
    }

    try {
      console.log("Attempting login with:", { email, password });
      
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);
      
      // Get the error message from the response
      const responseData = await response.json().catch(() => null);
      console.log("Response data:", responseData);

      if (!response.ok) {
        // This will show us the actual error message from the server
        throw new Error(responseData?.message || `Server error: ${response.status}`);
      }

      // If we get here, login was successful
      const data = responseData;
      toast.success("Login successful!");
      
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role", data.user.role || "user");
      
      // Store additional user info
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userAddress", data.user.address);
      localStorage.setItem("userPhno", data.user.phno);
      
      // Store supplier email specifically if user is a supplier
      if (data.user.role === "supplier") {
        localStorage.setItem("supplierEmail", data.user.email);
      }

      if (data.user.role === "supplier") {
        navigate("/supplier/dashboard");
      } else if (data.user.role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/homepage");
      }
    } catch (error) {
      console.error("Login error details:", error);
      toast.error(error.message || "Login failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      {/* Login Container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 py-4 px-6 text-center">
          <h1 className="text-2xl font-bold text-white">
            Bike<span className="text-yellow-400">Verse</span>
            <span className="ml-1" role="img" aria-label="bicycle">🚴</span>
          </h1>
          <p className="text-yellow-200 mt-1">Welcome back to your account</p>
        </div>

        {/* Login Form */}
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
          
          <form onSubmit={handleClick}>
            {/* Email Input */}
            <div className="mb-5">
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

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
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

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Registration Links */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Don't have an account?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Register as User
              </Link>
              <Link
                to="/supplier-register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Register as Supplier
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 py-4 px-6 text-center">
          <p className="text-xs text-gray-600">
            By continuing, you agree to BikeVerse's <br />
            <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> and{" "}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}