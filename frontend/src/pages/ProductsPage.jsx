// File: frontend/src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';

const ProductsPage = () => {
    // State to store the list of products
    const [products, setProducts] = useState([]);
    // State to manage loading status for the initial product fetch
    const [loading, setLoading] = useState(true);
    // State to handle any errors during the initial fetch
    const [error, setError] = useState(null);

    // New state for search functionality
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    // useEffect hook to fetch all products from the backend on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Function to handle the visual search
    const handleSearch = async () => {
        if (!searchQuery) {
            setSearchError('Please enter an image URL.');
            return;
        }
        
        setIsSearching(true);
        setSearchError(null);

        try {
            const response = await axios.post('http://localhost:5000/api/search', { image: searchQuery }, {
                withCredentials: true,
            });
            setSearchResults(response.data.similarProducts);
        } catch (err) {
            console.error('Error during search:', err);
            setSearchError('Failed to perform search. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    // Function to clear search results and show all products
    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSearchError(null);
    };

    if (loading) {
        return (
            <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
                <p className="text-xl text-gray-600">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }
    
    // Determine which list to display
    const currentProducts = searchResults.length > 0 ? searchResults : products;
    const title = searchResults.length > 0 ? 'Search Results' : 'All Products';

    return (
        <div className="bg-gray-100 p-8 min-h-[calc(100vh-6rem)]">
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-full max-w-lg flex flex-col md:flex-row gap-4">
                    <input
                        type="url"
                        placeholder="Enter image URL..."
                        className="flex-grow rounded-lg border-2 border-gray-300 p-3 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        disabled={isSearching}
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                    {searchResults.length > 0 && (
                        <button
                            onClick={handleClearSearch}
                            className="rounded-lg bg-gray-400 px-6 py-3 font-semibold text-white transition hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                        >
                            Clear
                        </button>
                    )}
                </div>
                {searchError && (
                    <p className="mt-4 text-red-500">{searchError}</p>
                )}
            </div>
            
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">{title}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;
