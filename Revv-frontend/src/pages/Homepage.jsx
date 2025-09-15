
// import Nav from "../components/Nav";
// import { useEffect, useState } from "react";
// import Products from "../components/Products";
// import SearchButton from "../components/SearchButton";

// export default function Homepage() {
//   const [email, setEmail] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("email");
//     if (storedEmail) {
//       setEmail(storedEmail);
//     }
//     fetchProducts();
//   }, []);

//   async function fetchProducts() {
//     try {
//       const response = await fetch("http://localhost:3000/products");
//       const data = await response.json();
//       // Shuffle products for variety
//       for (let i = data.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [data[i], data[j]] = [data[j], data[i]];
//       }
//       setProducts(data);
//       setFilteredProducts(data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   }

//   const handleSearch = (query) => {
//     const filtered = products.filter(
//       (product) =>
//         product.productName.toLowerCase().includes(query.toLowerCase()) ||
//         product.category.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredProducts(filtered);
//   };

//   return (
//     <div className="bg-cream min-h-dvh">
//       <Nav />
//       <div className="p-4">
//         <div className="mb-4 flex justify-center">
//           <SearchButton onSearch={handleSearch} />
//         </div>
//         <div className="grid grid-cols-4 gap-4">
//           {filteredProducts.length === 0 ? (
//             <div className="col-span-4 text-center text-xl text-gray-500">
//               No items to display
//             </div>
//           ) : (
//             filteredProducts.map((item, index) => (
//               <div key={index}>
//                 <Products
//                   productName={item.productName}
//                   rate={item.rate}
//                   description={item.description}
//                   imgURL={item.imgURL}
//                   supplierEmail={item.supplierEmail} // Added this line
//                 />
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import Products from "../components/Products";
import CategoryFilter from "../components/CategoryFilter"; // Make sure to import the CategoryFilter component

export default function Homepage() {
  const [email, setEmail] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Add state for category filter

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedName = localStorage.getItem("userName") || "Rider";
    if (storedEmail) {
      setEmail(storedEmail);
    }
    setUserName(storedName);
    fetchProducts();
  }, [selectedCategory]); // Add selectedCategory as a dependency

  // Update the fetchProducts function to include category filter
  const fetchProducts = async () => {
    try {
      let url = "http://localhost:3000/products";
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Shuffle products for variety
      for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
      }
      
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
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
        {/* Section Title and Category Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Latest Bikes
          </h2>
          {/* Add the CategoryFilter component */}
          <CategoryFilter onCategoryChange={setSelectedCategory} />
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">🚴</div>
            <h3 className="text-xl text-gray-600 mb-2">No bikes available</h3>
            <p className="text-gray-500">Check back later for new arrivals</p>
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
              <a href="#" className="hover:text-yellow-400 transition-colors text-sm">Browse Bikes</a>
              <a href="/order-history" className="hover:text-yellow-400 transition-colors text-sm">My Orders</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}