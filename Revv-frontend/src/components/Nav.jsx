import PropTypes from "prop-types";
import CartButton from "./CartButton";
import Logout from "./Logout";
import ReviewButton from "./ReviewButton";
import { Link, useNavigate } from "react-router-dom";
import Homebutton from "./Homebutton";
import { useState, useEffect } from "react";

export default function Nav({ cartCount }) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  function handleclick() {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div className="sticky z-50 top-0">
      <div className="grid grid-cols-12 bg-neutral-800 p-3">
        
        <div className="col-span-10 flex justify-center items-center">
          <Link className="ml-8 mr-8 object-cover h-14 w-14" to="/homepage">
            <Homebutton />
          </Link>
          <Link className="ml-8 mr-8" to="/cart">
            <CartButton totalItems={cartCount} />
          </Link>
          <Link className="ml-8 mr-8" to="/review">
            <ReviewButton />
          </Link>
          
          {/* Show Order History link for users */}
          {userRole === "user" && (
            <Link className="ml-8 mr-8 text-white hover:text-gray-300" to="/order-history">
              Order History
            </Link>
          )}
          
          {/* Show Admin Dashboard link for admins */}
          {userRole === "admin" && (
            <Link className="ml-8 mr-8 text-white hover:text-gray-300" to="/admin-dashboard">
              Admin Dashboard
            </Link>
          )}

          {userRole === "user" && (
  <Link className="ml-8 mr-8" to="/order-history">
    Order History
  </Link>
)}
        </div>

        <div
          onClick={handleclick}
          className="col-span-1 flex items-center justify-end"
        >
          <Logout />
        </div>
      </div>
    </div>
  );
}

Nav.propTypes = {
  email: PropTypes.string,
  cartCount: PropTypes.number,
};