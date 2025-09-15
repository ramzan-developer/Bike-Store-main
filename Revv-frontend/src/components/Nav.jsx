// import PropTypes from "prop-types";
// import CartButton from "./CartButton";
// import Logout from "./Logout";
// import ReviewButton from "./ReviewButton";
// import { Link, useNavigate } from "react-router-dom";
// import Homebutton from "./Homebutton";
// import { useState, useEffect } from "react";

// export default function Nav({ cartCount }) {
//   const navigate = useNavigate();
//   const [userRole, setUserRole] = useState(null);
  
//   useEffect(() => {
//     // Get user role from localStorage
//     const role = localStorage.getItem("role");
//     setUserRole(role);
//   }, []);

//   function handleclick() {
//     localStorage.removeItem("email");
//     localStorage.removeItem("role");
//     navigate("/");
//   }

//   return (
//     <div className="sticky z-50 top-0">
//       <div className="grid grid-cols-12 bg-neutral-800 p-3">
        
//         <div className="col-span-10 flex justify-center items-center">
//           <Link className="ml-8 mr-8 object-cover h-14 w-14" to="/homepage">
//             <Homebutton />
//           </Link>
//           <Link className="ml-8 mr-8" to="/cart">
//             <CartButton totalItems={cartCount} />
//           </Link>
//           <Link className="ml-8 mr-8" to="/review">
//             <ReviewButton />
//           </Link>
          
//           {/* Show Order History link for users */}
//           {userRole === "user" && (
//             <Link className="ml-8 mr-8 text-white hover:text-gray-300" to="/order-history">
//               Order History
//             </Link>
//           )}
          
//           {/* Show Admin Dashboard link for admins */}
//           {userRole === "admin" && (
//             <Link className="ml-8 mr-8 text-white hover:text-gray-300" to="/admin-dashboard">
//               Admin Dashboard
//             </Link>
//           )}

//           {userRole === "user" && (
//   <Link className="ml-8 mr-8" to="/order-history">
//     Order History
//   </Link>
// )}
//         </div>

//         <div
//           onClick={handleclick}
//           className="col-span-1 flex items-center justify-end"
//         >
//           <Logout />
//         </div>
//       </div>
//     </div>
//   );
// }

// Nav.propTypes = {
//   email: PropTypes.string,
//   cartCount: PropTypes.number,
// };

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
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("userName") || "User";
    setUserRole(role);
    setUserName(name);
  }, []);

  function handleclick() {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/");
  }

  // Get first letter of user's name for the avatar
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="sticky z-50 top-0 bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Welcome message with user avatar */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-800 font-bold text-lg">{userInitial}</span>
            </div>
            <span className="text-white font-medium">Welcome, {userName}</span>
          </div>

          {/* Right side - Navigation buttons */}
          <div className="flex items-center space-x-6">
            <Link to="/homepage" className="text-white hover:text-yellow-300 font-medium">
              Home
            </Link>
            
            <Link to="/cart" className="text-white hover:text-yellow-300 font-medium">
              <CartButton totalItems={cartCount} />
            </Link>
            
            <Link to="/review" className="text-white hover:text-yellow-300 font-medium">
              <ReviewButton />
            </Link>
            
            {/* Show Order History link for users */}
            {userRole === "user" && (
              <Link to="/order-history" className="text-white hover:text-yellow-300 font-medium">
                My Orders
              </Link>
            )}
            
            {/* Show Admin Dashboard link for admins */}
            {userRole === "admin" && (
              <Link to="/admin-dashboard" className="text-white hover:text-yellow-300 font-medium">
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleclick}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Nav.propTypes = {
  email: PropTypes.string,
  cartCount: PropTypes.number,
};