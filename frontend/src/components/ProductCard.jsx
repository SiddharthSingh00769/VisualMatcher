import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, similarityScore }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col overflow-hidden rounded-xl bg-gray-800 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-full h-80 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-1 leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 font-medium">
            {product.category}
          </p>
          {similarityScore !== undefined && (
            <p className="text-xs text-indigo-400 mt-1">
              Similarity: {similarityScore.toFixed(2)}%
            </p>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        <span className="text-white text-lg font-bold">View Details</span>
      </div>
    </div>
  );
};

export default ProductCard;
