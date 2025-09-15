import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import Products from "../components/Products";
import CategoryFilter from "../components/CategoryFilter";
import SearchButton from "../components/SearchButton";

export default function Homepage() {
  const [email, setEmail] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedName = localStorage.getItem("userName") || "Rider";
    if (storedEmail) {
      setEmail(storedEmail);
    }
    setUserName(storedName);
    fetchProducts();
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      let data = await response.json();
      
      // Shuffle products for variety
      for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
      }
      
      setProducts(data);
      applyFilters(data, selectedCategory, searchQuery);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Apply both category and search filters
  const applyFilters = (productsToFilter, category, query) => {
    let filtered = [...productsToFilter];
    
    // Apply category filter - only if a category is selected (not empty)
    if (category) {
      filtered = filtered.filter(product => 
        product.category && product.category._id === category
      );
    }
    // If category is empty (All Categories), don't filter by category
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(query.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    setFilteredProducts(filtered);
  };

  // const handleCategoryChange = (categoryId) => {
  //   setSelectedCategory(categoryId);
  //   applyFilters(products, categoryId, searchQuery);
  // };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(products, selectedCategory, query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Customer Dashboard
          </h1>
          <p className="text-yellow-200 text-lg">
            Welcome back {userName} 💷 Explore our latest bikes and grab the best deals today.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-6 gap-4">
          <div className="w-full md:w-1/2">
            <SearchButton onSearch={handleSearch} />
          </div>
          {/* <div className="w-full md:w-1/2">
            <CategoryFilter onCategoryChange={handleCategoryChange} />
          </div> */}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">🚴</div>
            <h3 className="text-xl text-gray-600 mb-2">
              {selectedCategory || searchQuery ? "No matching bikes found" : "No bikes available"}
            </h3>
            <p className="text-gray-500">
              {selectedCategory || searchQuery ? "Try different search criteria or category" : "Check back later for new arrivals"}
            </p>
            {(selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSearchQuery("");
                  applyFilters(products, "", "");
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Show All Bikes
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <Products
                  productName={item.productName}
                  rate={item.rate}
                  description={item.description}
                  imgURL={item.imgURL}
                  supplierEmail={item.supplierEmail}
                  category={item.category}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 BikeVerse | Customer Panel</p>
            </div>
            <div className="flex space-x-4">
              <a href="/homepage" className="hover:text-yellow-400 transition-colors text-sm">Home</a>
              <a href="/order-history" className="hover:text-yellow-400 transition-colors text-sm">My Orders</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}