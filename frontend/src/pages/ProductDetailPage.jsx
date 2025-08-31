import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
          withCredentials: true,
        });
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-100 animate-pulse">Loading Product...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-red-400">{error}</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-100">Product not found.</h1>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 min-h-screen p-4 md:p-8 text-gray-100 flex items-center justify-center overflow-hidden">

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-3xl md:flex rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm bg-gray-900 bg-opacity-70 animate-fadeInUp">
      {/* Product Image */}
      <div className="md:w-[45%] overflow-hidden">
        <img
          className="h-64 md:h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          src={product.imageUrl}
          alt={product.name}
        />
      </div>

      {/* Product Details */}
      <div className="p-4 md:p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="uppercase tracking-wide text-sm text-indigo-400 font-semibold">{product.category}</div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-white">{product.name}</h1>
          <p className="mt-2 md:mt-4 text-gray-300">{product.description}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full bg-indigo-600 px-6 py-2 font-semibold text-white shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>

    </div>
  );
};

export default ProductDetailPage;
