// File: backend/models/Product.js
// Description: This module defines the Mongoose schema and model for products.

// Import the Mongoose library
import mongoose from 'mongoose';

// Define the Product schema using mongoose.Schema
const ProductSchema = new mongoose.Schema({
    // 'name' is a string, required, and whitespace is trimmed
    name: {
        type: String,
        required: true,
        trim: true,
    },
    // 'category' is a string, required, and whitespace is trimmed
    category: {
        type: String,
        required: true,
        trim: true,
    },
    // 'description' is an optional string
    description: {
        type: String,
        trim: true,
    },
    // 'imageUrl' is a required string for the product image URL
    imageUrl: {
        type: String,
        required: true,
    },
    // New field for the image feature vector
    // This will be an array of numbers representing the image's visual features.
    featureVector: {
        type: [Number],
        required: false,
        default: []
    }
});

// Create the Product model from the schema.
// 'Product' is the name of the model, which will create a 'products' collection in MongoDB.
const Product = mongoose.model('Product', ProductSchema);

// Export the model for use in controllers and routes
export default Product;
