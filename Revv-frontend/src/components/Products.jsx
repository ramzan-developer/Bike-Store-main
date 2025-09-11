import AddToCartButton from "./AddToCartButton";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

export default function Products({ productName, rate, description, imgURL }) {
  const price = (90 / 100) * rate;
  const formattedRate = rate.toLocaleString("en-IN");
  const formattedPrice = price.toLocaleString("en-IN");
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  //handle the add to cart
  // In your Products.jsx component, update the handleClick function:
function handleClick(e) {
  e.preventDefault();
  toast.success("Product added to cart");
  
  const userEmail = localStorage.getItem("email");
  if (!userEmail) {
    toast.error("Please log in to add items to cart");
    navigate("/");
    return;
  }

  const product = {
    productName,
    price: rate,
    imgURL,
    quantity: 1,
    supplierEmail: "bakul@gmail.com" // You'll need to pass this as a prop
  };

  fetch("http://localhost:3000/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail, products: [product] }),
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
    <div className=" h-120 hover:border-1 hover:shadow-2xl  pro rounded-sm  overflow-hidden">
      <img
        src={imgURL}
        className="w-full h-3/5 object-cover"
        alt="img not available"
      />
      <div className=" pl-3 pt-1">
        <h1 className="text-3xl bg-darkbrown font-black mb-2">{productName}</h1>
        <h3 className="">{description}</h3>
        <p className="bg-darkbrown font-light line-through mt-4">
          ₹{formattedRate}
        </p>
        <div className="grid grid-cols-2 gap-24">
          <p className="bg-darkbrown font-black text-3xl">₹{formattedPrice}</p>
          <div onClick={(e) => handleClick(e)} className=" w-fit">
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
};



