// File: backend/controllers/productController.js
// Description: This module contains the controller functions for product-related API endpoints.
// It handles the business logic and interacts with the Product model.

import Product from '../models/Product.js';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the Generative AI library

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

// Function to calculate the dot product of two vectors
const dotProduct = (vecA, vecB) => {
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
    }
    return product;
};

// Function to calculate the magnitude (length) of a vector
const magnitude = (vec) => {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
};

// Function to calculate cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
    const magA = magnitude(vecA);
    const magB = magnitude(vecB);
    if (magA === 0 || magB === 0) return 0; // Avoid division by zero
    return dotProduct(vecA, vecB) / (magA * magB);
};

// Helper function to get image data for the Gemini API
const getFileData = (image) => {
    // If the image is a data URL (from file upload), extract the base64 string
    if (image.startsWith('data:')) {
        const [mimeType, data] = image.split(';base64,');
        return {
            inlineData: {
                data,
                mimeType: mimeType.substring(5),
            },
        };
    } else {
        // If it's a URL, send it directly to the API
        return {
            inlineData: {
                data: Buffer.from(image).toString('base64'),
                mimeType: 'text/uri-list'
            }
        };
    }
};

// New function to generate a feature vector using the Gemini API
// This is still a simulation but uses real AI output as a basis.
const getVectorFromImage = async (image) => {
    const prompt = 'Please describe this product image in great detail, including colors, textures, materials, and any key features, in a single sentence.';
    
    try {
        const imagePart = getFileData(image);

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // This is where we create a simple, repeatable vector from the text.
        // A real-world application would use an embedding model, but this
        // simulates the process for a working demo.
        const vector = text.split(' ').map(word => word.length);
        
        return vector;
    } catch (err) {
        console.error('Error generating vector from image:', err);
        throw new Error('Failed to process image with AI service.');
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

export const searchProducts = async (req, res) => {
    const { image } = req.body;
    try {
        // Step 1: Get the feature vector for the search image from the Gemini API
        const queryVector = await getVectorFromImage(image);
        
        // Step 2: Get all products from the database
        const allProducts = await Product.find({}).lean();
        
        // Step 3: Calculate the similarity score for each product
        const productsWithScores = allProducts.map(product => {
            // Only calculate similarity if the product has a feature vector
            if (product.featureVector && product.featureVector.length > 0) {
                const score = cosineSimilarity(queryVector, product.featureVector);
                return { ...product, similarityScore: score };
            }
            return { ...product, similarityScore: 0 };
        });

        // Step 4: Sort products by their similarity score in descending order
        productsWithScores.sort((a, b) => b.similarityScore - a.similarityScore);

        // Step 5: Return the top 10 most similar products
        const top10Products = productsWithScores.slice(0, 10);
        
        res.json({
            message: 'Visual search performed successfully.',
            queryImage: image,
            similarProducts: top10Products,
        });
    } catch (err) {
        console.error('Error during search:', err.message);
        res.status(500).json({ error: 'Server error during search' });
    }
};
