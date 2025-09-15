// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const SupplierManageBikes = () => {
//   const navigate = useNavigate();
//   const BASE_URL = "http://localhost:3000";

//   const [bike, setBike] = useState({
//     productName: "",
//     rate: "",
//     category: "",
//     description: "",
//     imgURL: "",
//     supplierEmail: localStorage.getItem("email") || "",
//   });

//   const [bikes, setBikes] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [supplierEmail, setSupplierEmail] = useState("");
//   const [categories, setCategories] = useState([]);

// // Fetch categories on component mount
// useEffect(() => {
//   fetchCategories();
// }, []);

// const fetchCategories = async () => {
//   try {
//     const response = await fetch("http://localhost:3000/categories");
//     const data = await response.json();
//     setCategories(data);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     toast.error("Failed to load categories");
//   }
// };

//   useEffect(() => {
//     const email = localStorage.getItem("email");
//     if (!email) {
//       toast.error("Please log in as a supplier");
//       navigate("/");
//       return;
//     }
//     setSupplierEmail(email);
//     setBike(prev => ({ ...prev, supplierEmail: email }));
//     fetchBikes(email);
//   }, []);

//   const fetchBikes = async (email) => {
//     try {
//       const response = await fetch(`${BASE_URL}/products`);
//       if (!response.ok) throw new Error("Failed to fetch products");
      
//       const data = await response.json();
//       // Filter to show only this supplier's bikes
//       const myBikes = data.filter(b => b.supplierEmail === email);
//       setBikes(myBikes);
//     } catch (error) {
//       console.error("Fetch bikes error:", error);
//       toast.error("Failed to load bikes");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setBike(prev => ({
//       ...prev,
//       [name]: name === "rate" ? Number(value) : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!supplierEmail) {
//       toast.error("Please log in as a supplier");
//       return;
//     }

//     // Validate required fields
//     if (!bike.productName || !bike.category || !bike.rate || !bike.description) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     const payload = {
//       ...bike,
//       rate: Number(bike.rate),
//       supplierEmail: supplierEmail
//     };

//     const method = editId ? "PUT" : "POST";
//     const url = editId ? `${BASE_URL}/products/${editId}` : `${BASE_URL}/products`;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.message || "Request failed");
//       }

//       const data = await res.json();
//       toast.success(`Bike ${editId ? "updated" : "added"} successfully`);

//       // Reset form
//       setBike({
//         productName: "",
//         rate: "",
//         category: "",
//         description: "",
//         imgURL: "",
//         supplierEmail: supplierEmail,
//       });
//       setEditId(null);

//       // Refresh bike list
//       fetchBikes(supplierEmail);
//     } catch (error) {
//       console.error("Add/update bike error:", error);
//       toast.error(error.message || "Something went wrong");
//     }
//   };

//   const handleEdit = (bike) => {
//     setBike(bike);
//     setEditId(bike._id);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this bike?")) return;
    
//     try {
//       const res = await fetch(`${BASE_URL}/products/${id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error("Failed to delete bike");

//       setBikes(bikes.filter((b) => b._id !== id));
//       toast.success("Bike deleted successfully");
//     } catch (error) {
//       console.error("Delete failed:", error);
//       toast.error("Failed to delete bike");
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-blue-700">Manage My Bikes</h1>
//         <button
//           onClick={() => navigate("/supplier/dashboard")}
//           className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
//         >
//           ← Back to Dashboard
//         </button>
//       </div>

//       {/* Add/Edit Bike Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-xl shadow max-w-2xl mb-8 mx-auto"
//       >
//         <h2 className="text-xl font-semibold mb-4 text-blue-600">
//           {editId ? "Edit Bike" : "Add New Bike"}
//         </h2>
//         <div className="grid grid-cols-1 gap-4">
//           <input
//             name="productName"
//             value={bike.productName}
//             onChange={handleChange}
//             placeholder="Bike Name *"
//             required
//             className="p-2 border rounded"
//           />
//           <select
//               name="category"
//               value={bike.category}
//               onChange={handleChange}
//               required
//               className="p-2 border rounded"
//             >
//               <option value="">Select Category</option>
//               {categories.map((category) => (
//                 <option key={category._id} value={category._id}>
//                   {category.name}
//                 </option>
//               ))}
//           </select>
//           <input
//             name="rate"
//             type="number"
//             value={bike.rate}
//             onChange={handleChange}
//             placeholder="Price *"
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             name="imgURL"
//             value={bike.imgURL}
//             onChange={handleChange}
//             placeholder="Image URL"
//             className="p-2 border rounded"
//           />
//           <textarea
//             name="description"
//             value={bike.description}
//             onChange={handleChange}
//             placeholder="Description *"
//             required
//             className="p-2 border rounded"
//             rows="3"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
//           >
//             {editId ? "Update Bike" : "Add Bike"}
//           </button>
//         </div>
//       </form>

//       {/* Bike Table */}
//       <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto overflow-x-auto">
//         <h2 className="text-xl font-semibold mb-4 text-blue-600">
//           My Bikes List ({bikes.length})
//         </h2>
//         {bikes.length === 0 ? (
//           <p className="text-center text-gray-500 py-4">No bikes found. Add your first bike above.</p>
//         ) : (
//           <table className="min-w-full table-auto text-left border-collapse">
//             <thead>
//               <tr className="bg-blue-600 text-white">
//                 <th className="p-2">Image</th>
//                 <th className="p-2">Name</th>
//                 <th className="p-2">Category</th>
//                 <th className="p-2">Price</th>
//                 <th className="p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bikes.map((b) => (
//                 <tr key={b._id} className="border-t hover:bg-gray-50">
//                   <td className="p-2">
//                     {b.imgURL ? (
//                       <img src={b.imgURL} alt={b.productName} className="h-16 w-auto object-cover" />
//                     ) : (
//                       <div className="h-16 w-16 bg-gray-200 flex items-center justify-center">
//                         <span className="text-gray-500">No Image</span>
//                       </div>
//                     )}
//                   </td>
//                   <td className="p-2 font-medium">{b.productName}</td>
//                   <td className="p-2">{b.category}</td>
//                   <td className="p-2">₹{b.rate.toLocaleString("en-IN")}</td>
//                   <td className="p-2 space-x-2">
//                     <button
//                       onClick={() => handleEdit(b)}
//                       className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(b._id)}
//                       className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupplierManageBikes;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SupplierManageBikes = () => {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:3000";

  const [bike, setBike] = useState({
    productName: "",
    rate: "",
    category: "",
    description: "",
    imgURL: "",
    supplierEmail: localStorage.getItem("email") || "",
  });

  const [bikes, setBikes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [supplierEmail, setSupplierEmail] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Please log in as a supplier");
      navigate("/");
      return;
    }
    setSupplierEmail(email);
    setBike(prev => ({ ...prev, supplierEmail: email }));
    fetchBikes(email);
  }, []);

  const fetchBikes = async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();
      // Filter to show only this supplier's bikes
      const myBikes = data.filter(b => b.supplierEmail === email);
      setBikes(myBikes);
    } catch (error) {
      console.error("Fetch bikes error:", error);
      toast.error("Failed to load bikes");
    }
  };

  // Helper function to get category name by ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "No Category";
    
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBike(prev => ({
      ...prev,
      [name]: name === "rate" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!supplierEmail) {
      toast.error("Please log in as a supplier");
      return;
    }

    // Validate required fields
    if (!bike.productName || !bike.category || !bike.rate || !bike.description) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      ...bike,
      rate: Number(bike.rate),
      supplierEmail: supplierEmail
    };

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${BASE_URL}/products/${editId}` : `${BASE_URL}/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
      }

      const data = await res.json();
      toast.success(`Bike ${editId ? "updated" : "added"} successfully`);

      // Reset form
      setBike({
        productName: "",
        rate: "",
        category: "",
        description: "",
        imgURL: "",
        supplierEmail: supplierEmail,
      });
      setEditId(null);

      // Refresh bike list
      fetchBikes(supplierEmail);
    } catch (error) {
      console.error("Add/update bike error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleEdit = (bike) => {
    setBike(bike);
    setEditId(bike._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bike?")) return;
    
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete bike");

      setBikes(bikes.filter((b) => b._id !== id));
      toast.success("Bike deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete bike");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Manage My Bikes</h1>
        <button
          onClick={() => navigate("/supplier/dashboard")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Add/Edit Bike Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-2xl mb-8 mx-auto"
      >
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          {editId ? "Edit Bike" : "Add New Bike"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            name="productName"
            value={bike.productName}
            onChange={handleChange}
            placeholder="Bike Name *"
            required
            className="p-2 border rounded"
          />
          <select
            name="category"
            value={bike.category}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            name="rate"
            type="number"
            value={bike.rate}
            onChange={handleChange}
            placeholder="Price *"
            required
            className="p-2 border rounded"
          />
          <input
            name="imgURL"
            value={bike.imgURL}
            onChange={handleChange}
            placeholder="Image URL"
            className="p-2 border rounded"
          />
          <textarea
            name="description"
            value={bike.description}
            onChange={handleChange}
            placeholder="Description *"
            required
            className="p-2 border rounded"
            rows="3"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
          >
            {editId ? "Update Bike" : "Add Bike"}
          </button>
        </div>
      </form>

      {/* Bike Table */}
      <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          My Bikes List ({bikes.length})
        </h2>
        {bikes.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No bikes found. Add your first bike above.</p>
        ) : (
          <table className="min-w-full table-auto text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Price</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bikes.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    {b.imgURL ? (
                      <img src={b.imgURL} alt={b.productName} className="h-16 w-auto object-cover" />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-2 font-medium">{b.productName}</td>
                  <td className="p-2">{getCategoryName(b.category)}</td>
                  <td className="p-2">₹{b.rate.toLocaleString("en-IN")}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SupplierManageBikes;