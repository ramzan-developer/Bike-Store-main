import { Link } from "react-router-dom";
import banner from "../photos/banner.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 py-3 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white">
                Bike<span className="text-yellow-400">Verse</span>
                <span className="ml-1">🚴</span>
              </h1>
            </Link>
            
            {/* Welcome Text */}
            <div className="text-yellow-400 font-semibold text-center mb-4 md:mb-0">
              <i className="fas fa-bicycle mr-2"></i>
              Welcome to BikeVerse
            </div>
            
            {/* Navigation */}
            <nav className="flex flex-wrap justify-center space-x-2 md:space-x-4">
              <Link to="/login" className="text-white px-3 py-1 font-medium hover:bg-blue-700 rounded">
                Login
              </Link>
              <Link to="/register" className="text-white px-3 py-1 font-medium hover:bg-blue-700 rounded">
                Register
              </Link>
              <Link to="/supplier-register" className="text-white px-3 py-1 font-medium hover:bg-blue-700 rounded">
                Supplier Register
              </Link>
              <Link to="/about" className="text-white px-3 py-1 font-medium hover:bg-blue-700 rounded">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {/* Hero Banner - Replace with your image */}
        <div
  className="h-130 bg-cover bg-center rounded-lg mb-8 shadow-lg"
  style={{ backgroundImage: `url(${banner})` }}
>
  <div className="h-full flex flex-col justify-center items-center bg-black/30 rounded-lg">
    <h2 className="text-4xl font-bold text-white uppercase tracking-wider mb-4">Explore the World of Bikes!</h2>
  </div>
</div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Wide Range Card */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-300">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-biking"></i>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Wide Range of Bikes</h3>
            <p className="text-gray-600 mb-4">
              Explore sports, mountain, and electric bikes from top suppliers.
            </p>
            <Link 
              to="/homepage" 
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded"
            >
              Shop Now
            </Link>
          </div>

          {/* Trusted Suppliers Card */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-300">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Trusted Suppliers</h3>
            <p className="text-gray-600 mb-4">
              All bikes are provided by verified suppliers ensuring quality.
            </p>
            <Link 
              to="/about" 
              className="inline-block border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2 px-4 rounded"
            >
              Learn More
            </Link>
          </div>

          {/* Easy Ordering Card */}
         <div className="bg-white p-6 rounded-lg shadow-md text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-300">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Easy Ordering</h3>
            <p className="text-gray-600 mb-4">
              Order bikes online with a simple and secure checkout system.
            </p>
            <Link 
              to="/register" 
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <div className="container mx-auto px-4">
          <p>© 2025 BikeVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;