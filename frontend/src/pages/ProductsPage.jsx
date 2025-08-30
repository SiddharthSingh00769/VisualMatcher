// File: frontend/src/pages/ProductsPage.jsx
// Description: This page displays all products and includes the visual search interface.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [searchImage, setSearchImage] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [file, setFile] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    setSearchMode(false);
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        withCredentials: true,
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setSearchMode(true);
    let imageToSend;

    try {
      if (file) {
        // Handle file upload
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          imageToSend = reader.result;
          setSearchImage(imageToSend);
          await sendSearchRequest(imageToSend);
        };
      } else if (imageUrl) {
        // Handle image URL
        imageToSend = imageUrl;
        setSearchImage(imageUrl);
        await sendSearchRequest(imageToSend);
      }
    } catch (err) {
      console.error('Error during search setup:', err);
      setError('Failed to initiate search. Please check your image source.');
      setLoading(false);
    }
  };

  const sendSearchRequest = async (image) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/search',
        { image },
        { withCredentials: true }
      );
      setProducts(response.data.similarProducts);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to fetch search results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    fetchProducts();
    setImageUrl('');
    setSearchImage(null);
    setFile(null);
    setSearchMode(false);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setSearchImage(URL.createObjectURL(uploadedFile));
      setImageUrl('');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-100 md:text-4xl">
          {searchMode ? 'Search Results' : 'All Products'}
        </h1>

        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <div className="w-full max-w-2xl flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              className="flex-grow rounded-lg border-2 border-gray-700 bg-gray-800 text-gray-100 p-3 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setFile(null);
                setSearchImage(e.target.value);
              }}
            />
            <div className='text-4xl font-bold text-center text-white'>
              OR
            </div>
            <div className="relative w-full md:w-auto cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
              />
              <div className="w-full rounded-lg bg-gray-900 px-6 py-3 text-center font-semibold text-gray-100 transition hover:bg-gray-600">
                Choose File
              </div>
            </div>
          </div>
          <button
              onClick={handleSearch}
              className="cursor-pointer w-full md:w-auto rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              disabled={loading || (!imageUrl && !file)}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          {searchMode && (
            <button
              onClick={handleClear}
              className="rounded-lg bg-gray-500 px-4 py-2 font-semibold text-white transition hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {searchImage && (
          <div className="mb-8 flex flex-col items-center justify-center p-4 rounded-lg shadow-inner bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Searching with this image:</h2>
            <div className="w-48 h-48 md:w-64 md:h-64 overflow-hidden rounded-lg shadow-lg">
              <img src={searchImage} alt="Search Query" className="w-full h-full object-cover"/>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-48">
            <p className="text-xl font-medium text-gray-400">Loading products...</p>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-48">
            <p className="text-xl text-red-400">{error}</p>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        {!loading && !error && products.length === 0 && searchMode && (
          <div className="flex justify-center items-center h-48">
            <p className="text-xl font-medium text-gray-400">No similar products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
