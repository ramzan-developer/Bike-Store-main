import { useState } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //handle the login button
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
    <div className="login h-screen w-screen grid grid-cols-3  ">
      <div className="col-span-2 grid items-center justify-center ">
        <form action="" className="bg-gray-50 rounded-2xl  p-7 pb-8">
          <h1 className="text-3xl mb-6 font-extrabold text-center">Login</h1>
          <h2 className="font-bold mb-2">Email:</h2>
          <input
            className="border-2 p-2 w-80 border-b-gray-900 mb-6"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
            value={email}
          />
          <h2 className="font-bold mb-2">Password: </h2>
          <input
            className="border-2 p-2 w-80 border-b-gray-900 mb-6"
            type="Password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
            value={password}
          />
          <div className="flex mb-5 justify-center">
            <div onClick={(e) => handleClick(e)}>
              <Button />
            </div>
          </div>
          <div className="h-0.5 ml-5 w-72 bg-gray-900"></div>
          <div className="flex flex-col items-center mt-4 space-y-2">
            <h5 className="text-gray-700 font-medium">Don't have an account?</h5>
            <div className="flex gap-4">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Register as User
              </Link>
              <Link
                to="/supplier-register"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Register as Supplier
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}