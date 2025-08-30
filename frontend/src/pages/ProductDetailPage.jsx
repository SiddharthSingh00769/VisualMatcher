// File: frontend/src/pages/ProductDetailPage.jsx
// Description: A page to display a single product's details.

import React, { useState, useEffect } from 'react';
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
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-100">Loading Product...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-red-400">{error}</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-100">Product not found.</h1>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 min-h-screen p-4 md:p-8 text-gray-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden md:flex bg-gray-800 max-h-[90vh]">
        <div className="md:w-full">
          <img className="h-80 w-full object-cover md:h-full md:w-full" src={product.imageUrl} alt={product.name} />
        </div>
        <div className="p-6 flex-grow overflow-y-auto flex flex-col">
          <div className="uppercase tracking-wide text-sm text-indigo-400 font-semibold">{product.category}</div>
          <h1 className="block mt-1 text-3xl leading-tight font-bold text-white">{product.name}</h1>
          <p className="mt-2 text-gray-300 mb-4">{product.description}</p>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-700"
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
