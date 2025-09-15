import { Link } from "react-router-dom";

const About = () => {
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
            
            {/* Navigation */}
            <nav className="flex flex-wrap justify-center space-x-2 md:space-x-4">
              <Link to="/" className="text-white px-3 py-1 font-medium hover:bg-blue-700 rounded">
                Home
              </Link>
              <Link to="/about" className="text-white px-3 py-1 font-medium bg-blue-800 rounded">
                About Us
              </Link>
              {/* <Link to="/contact" className="text-white px-3 py-1 font-medium hover:bg-blue-700 rounded">
                Contact Us
              </Link> */}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">About BikeVerse</h1>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-bold text-blue-700 mb-4">Welcome to BikeVerse</h2>
                <p className="text-gray-700 text-lg mb-4">
                  Your trusted destination for premium bikes. We connect passionate riders with verified suppliers
                  across the country. Our platform offers sports bikes, mountain bikes, e-bikes, and more at affordable prices.
                </p>
                <p className="text-gray-700 text-lg">
                  At BikeVerse, we believe biking is not just transport - it's a lifestyle. Our mission is to promote sustainable travel, healthy living,
                  and adventure for everyone.
                </p>
              </div>
              <div className="md:w-1/3">
                <div className="bg-blue-100 rounded-lg p-4 text-center h-40 flex items-center justify-center">
                  <span className="text-6xl">🚴‍♂️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-4xl mb-4">
                <i className="fas fa-leaf"></i>
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Sustainable Travel</h3>
              <p className="text-gray-600">
                Promoting eco-friendly transportation options to reduce carbon footprint and create greener cities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-4xl mb-4">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Healthy Living</h3>
              <p className="text-gray-600">
                Encouraging active lifestyles through cycling for better physical and mental health.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-4xl mb-4">
                <i className="fas fa-mountain"></i>
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Adventure</h3>
              <p className="text-gray-600">
                Unlocking new experiences and adventures through the freedom of cycling.
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-blue-50 rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Our Story</h2>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="bg-blue-200 rounded-lg p-4 text-center h-40 flex items-center justify-center">
                  <span className="text-6xl">🌟</span>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-8">
                <p className="text-gray-700 text-lg mb-4">
                  BikeVerse was founded in 2025 by a group of cycling enthusiasts who wanted to make quality bikes more accessible to everyone. 
                  We noticed that many people struggled to find reliable bikes from trusted suppliers at reasonable prices.
                </p>
                <p className="text-gray-700 text-lg">
                  Today, we've grown into a platform that connects thousands of riders with verified suppliers across the country, 
                  offering a wide range of bikes for every need and budget.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👨‍💼</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Ashif Shekh</h3>
                <p className="text-blue-600 font-medium mb-2">Founder & CEO</p>
                <p className="text-gray-600">
                  Cycling enthusiast with 15+ years of experience in the biking industry.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👩‍💻</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Mr. Akshat & Shahil</h3>
                <p className="text-blue-600 font-medium mb-2">Head of Operations</p>
                <p className="text-gray-600">
                  Ensures smooth operations and excellent customer experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold">
                Bike<span className="text-yellow-400">Verse</span>
              </h2>
              <p className="text-gray-400 mt-2">© 2025 BikeVerse. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;