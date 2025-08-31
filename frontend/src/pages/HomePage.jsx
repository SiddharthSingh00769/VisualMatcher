import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 overflow-hidden font-inter text-white antialiased p-4">

      {/* Content Card */}
      <div className="relative z-10 text-center p-8 md:p-12 bg-gray-900 bg-opacity-70 rounded-3xl shadow-2xl backdrop-blur-sm max-w-3xl mx-auto animate-fadeInUp">
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-indigo-400 animate-slideInLeft">
          Visual Matcher
        </h1>

        <p className="text-xl md:text-2xl font-light mb-10 text-gray-300 animate-slideInRight">
          Unlock the power of sight. Instantly find and explore similar products from a vast catalog, powered by cutting-edge AI.
        </p>

        <Link 
          to="/auth" 
          className="inline-block px-12 py-5 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110 animate-zoomIn"
        >
          Get Started
        </Link>
      </div>
      
    </div>
  );
};

export default HomePage;
