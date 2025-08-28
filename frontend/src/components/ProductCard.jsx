// File: frontend/src/components/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-72 object-cover" // Increased height to make the image more prominent
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Not+Found';
                }}
            />
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {product.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {product.description}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
