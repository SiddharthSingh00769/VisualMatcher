import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        setMessage('Product added successfully!');
        setFormData({
          name: '',
          category: '',
          description: '',
          imageUrl: '',
        });
        setTimeout(() => navigate('/products'), 2000); 
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage(err.response?.data?.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 min-h-screen p-4 md:p-8 flex items-center justify-center text-gray-100">
      <div className="w-full max-w-md rounded-xl bg-gray-800 p-8 shadow-2xl md:p-10">
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Product Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-2 border-gray-700 bg-gray-900 text-gray-100 p-3 transition focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-2 border-gray-700 bg-gray-900 text-gray-100 p-3 transition focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-2 border-gray-700 bg-gray-900 text-gray-100 p-3 transition focus:border-indigo-500 focus:outline-none"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-2 border-gray-700 bg-gray-900 text-gray-100 p-3 transition focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 rounded-lg p-3 text-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductPage;