import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories/all");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);
    try {
      const email = localStorage.getItem("email");
      const response = await fetch("http://localhost:3000/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newCategory,
          createdBy: email,
        }),
      });

      if (response.ok) {
        toast.success("Category created successfully");
        setNewCategory({ name: "", description: "" });
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingCategory),
      });

      if (response.ok) {
        toast.success("Category updated successfully");
        setEditingCategory(null);
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`http://localhost:3000/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const toggleCategoryStatus = async (category) => {
    try {
      const response = await fetch(`http://localhost:3000/categories/${category._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...category,
          isActive: !category.isActive,
        }),
      });

      if (response.ok) {
        toast.success(`Category ${!category.isActive ? "activated" : "deactivated"} successfully`);
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.error("Failed to update category status");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Category Management</h2>

      {/* Add/Edit Category Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h3>
        <form
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          <input
            type="text"
            placeholder="Category Name"
            value={editingCategory ? editingCategory.name : newCategory.name}
            onChange={(e) =>
              editingCategory
                ? setEditingCategory({ ...editingCategory, name: e.target.value })
                : setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            value={editingCategory ? editingCategory.description : newCategory.description}
            onChange={(e) =>
              editingCategory
                ? setEditingCategory({ ...editingCategory, description: e.target.value })
                : setNewCategory({ ...newCategory, description: e.target.value })
            }
            className="p-2 border rounded"
          />
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400"
            >
              {isLoading
                ? "Processing..."
                : editingCategory
                ? "Update Category"
                : "Add Category"}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Categories</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{category.name}</td>
                  <td className="p-3">{category.description || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        category.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleCategoryStatus(category)}
                      className={`px-3 py-1 rounded ${
                        category.isActive
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {category.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;