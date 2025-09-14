import AddToCartButton from "./AddToCartButton";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Products({ productName, rate, description, imgURL, supplierEmail }) {
  const price = (90 / 100) * rate;
  const formattedRate = rate.toLocaleString("en-IN");
  const formattedPrice = price.toLocaleString("en-IN");
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Handle the add to cart
  function handleClick(e) {
  e.preventDefault();
  
  if (!email) {
    toast.error("Please log in to add items to cart");
    navigate("/");
    return;
  }
  
  // Validate that we have a supplier email
  if (!supplierEmail) {
    toast.error("Product supplier information is missing");
    return;
  }
  
  toast.success("Product added to cart");
  
  const product = {
    productName,
    price: rate,
    imgURL,
    quantity: 1,
    supplierEmail: supplierEmail // Use the actual prop value
  };


    fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail: email, products: [product] }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Cart updated:", data);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add product to cart");
      });
  }

  return (
    <div className="h-120 hover:border-1 hover:shadow-2xl pro rounded-sm overflow-hidden">
      <img
        src={imgURL}
        className="w-full h-3/5 object-cover"
        alt="img not available"
      />
      <div className="pl-3 pt-1">
        <h1 className="text-3xl bg-darkbrown font-black mb-2">{productName}</h1>
        <h3 className="">{description}</h3>
        <p className="bg-darkbrown font-light line-through mt-4">
          ₹{formattedRate}
        </p>
        <div className="grid grid-cols-2 gap-24">
          <p className="bg-darkbrown font-black text-3xl">₹{formattedPrice}</p>
          <div onClick={(e) => handleClick(e)} className="w-fit">
            <AddToCartButton />
          </div>
        </div>
      </div>
    </div>
  );
}

Products.propTypes = {
  productName: PropTypes.string.isRequired,
  rate: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  imgURL: PropTypes.string.isRequired,
  supplierEmail: PropTypes.string.isRequired, // Add this prop validation
};

// Optional: Add default props as a fallback
Products.defaultProps = {
  supplierEmail: "", // Empty string as default
};