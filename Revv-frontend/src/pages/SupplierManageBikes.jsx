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
  supplierEmail: localStorage.getItem("supplierEmail") || "",
});


  const [bikes, setBikes] = useState([]);
  const [editId, setEditId] = useState(null);
useEffect(() => {
  const supplierEmail = localStorage.getItem("supplierEmail");
  if (!supplierEmail) return;

  fetch(`${BASE_URL}/products`)
    .then((res) => res.json())
    .then((data) => {
      // only show this supplier’s bikes
      const myBikes = data.filter((b) => b.supplierEmail === supplierEmail);
      setBikes(myBikes);
    })
    .catch((err) => console.error("Fetch bikes error:", err));
}, []);

// ---- handleChange: cast rate to Number for state ----
const handleChange = (e) => {
  const { name, value } = e.target;
  setBike((prev) => ({
    ...prev,
    [name]: name === "rate" ? value : value, // keep controlled input; convert on submit
  }));
};

// ---- handleSubmit: validate, cast rate, better error handling ----
const handleSubmit = async (e) => {
  e.preventDefault();

  const supplierEmail = localStorage.getItem("supplierEmail");
  if (!supplierEmail) {
    toast.error("Please log in as a supplier (supplierEmail missing).");
    return;
  }

  // prepare payload and cast rate
  const payload = {
    ...bike,
    supplierEmail,
    rate: Number(bike.rate), // cast here
  };

  // simple frontend validation before sending
  if (
    !payload.productName ||
    !payload.category ||
    !payload.description ||
    !payload.imgURL ||
    isNaN(payload.rate)
  ) {
    toast.error("Please fill all required fields (name, category, description, image, price).");
    return;
  }

  const method = editId ? "PUT" : "POST";
  const url = editId ? `${BASE_URL}/products/${editId}` : `${BASE_URL}/products`;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // read server error body to show clear message
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || "Request failed");
    }

    const data = await res.json();

    toast.success(`Bike ${editId ? "updated" : "added"} successfully`);

    // reset form (keep supplierEmail from localStorage)
    setBike({
      productName: "",
      rate: "",
      category: "",
      description: "",
      imgURL: "",
      supplierEmail: supplierEmail || "",
    });

    setEditId(null);

    setBikes((prev) => (editId ? prev.map((b) => (b._id === editId ? data : b)) : [...prev, data]));
  } catch (err) {
    // show the actual server error message
    toast.error(err.message || "Something went wrong");
    console.error("Add/update bike error:", err);
  }
};

  const handleEdit = (bike) => {
    setBike(bike);
    setEditId(bike._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed");

      setBikes(bikes.filter((b) => b._id !== id));
      toast.success("Bike deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Manage My Bikes</h1>
        <button
          onClick={() => navigate("/supplier-dashboard")}
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
            placeholder="Bike Name"
            required
            className="p-2 border rounded"
          />
          <input
            name="category"
            value={bike.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className="p-2 border rounded"
          />
          
          <input
            name="rate"
            type="number"
            value={bike.rate}
            onChange={handleChange}
            placeholder="Price"
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
            placeholder="Description"
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {editId ? "Update Bike" : "Add Bike"}
          </button>
        </div>
      </form>

      {/* Bike Table */}
      <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          My Bikes List
        </h2>
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
                  <img src={b.imgURL} alt="bike" className="h-16 w-auto" />
                </td>
                <td className="p-2 font-medium">{b.productName}</td>
                <td className="p-2">{b.category}</td>
                <td className="p-2">₹ {b.rate}</td>
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
            {!bikes.length && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-4">
                  No bikes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierManageBikes;
