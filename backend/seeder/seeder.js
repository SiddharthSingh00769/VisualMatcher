// File: backend/seeder/seeder.js
// Description: Script to seed the database with sample products and users.
// This is a one-time script for development purposes.

import dotenv from 'dotenv';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import User from '../models/User.js';
import connectDB from '../db/connect.js';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the project root using a resolved path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Get the MongoDB URI from the environment variables
const MONGO_URI = process.env.MONGO_URI;

// Sample product data
const sampleProducts = [
  {
    name: 'Denim Jacket',
    category: 'Apparel',
    description: 'Classic blue denim jacket with a relaxed fit.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1698260795321-4d56527a3f32?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Minimalist T-Shirt',
    category: 'Apparel',
    description: 'A simple white tee, comfortable and versatile.',
    imageUrl: 'https://images.unsplash.com/photo-1659592987637-c766206e72b8?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Boots',
    category: 'Shoes',
    description: 'Stylish leather boots, perfect for autumn and winter.',
    imageUrl: 'https://images.unsplash.com/photo-1599012307605-23a0ebe4d321?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'White Sneakers',
    category: 'Shoes',
    description: 'Clean white sneakers that go with any casual outfit.',
    imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Over-Ear Headphones',
    category: 'Electronics',
    description: 'High-quality headphones for studio-grade audio.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-ce6c5d63f739?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Smart Watch',
    category: 'Electronics',
    description: 'A stylish smart watch with health tracking features.',
    imageUrl: 'https://images.unsplash.com/photo-1620706240097-40c21087d03a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Modern Coffee Table',
    category: 'Furniture',
    description: 'A sleek, modern coffee table made of polished wood.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c91ac641?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Executive Office Chair',
    category: 'Furniture',
    description: 'Ergonomic chair for maximum comfort during long work hours.',
    imageUrl: 'https://images.unsplash.com/photo-1601614838640-1e5b8e968393?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Yoga Mat',
    category: 'Fitness',
    description: 'Non-slip yoga mat for a perfect grip.',
    imageUrl: 'https://images.unsplash.com/photo-1549576495-3b4260907106?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Fitness Dumbbells',
    category: 'Fitness',
    description: 'Adjustable dumbbell set for a full-body workout.',
    imageUrl: 'https://images.unsplash.com/photo-1622909415510-a29d5b4d792e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Elegant Handbag',
    category: 'Accessories',
    description: 'A luxurious handbag for a touch of elegance.',
    imageUrl: 'https://images.unsplash.com/photo-1566150995172-13271f20ac34?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Belt',
    category: 'Accessories',
    description: 'A high-quality leather belt that complements any outfit.',
    imageUrl: 'https://images.unsplash.com/photo-1622329775010-093551532824?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Formal Dress Shirt',
    category: 'Apparel',
    description: 'A crisp formal shirt for professional settings.',
    imageUrl: 'https://images.unsplash.com/photo-1598033106883-9b48695029e2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Slim Fit Jeans',
    category: 'Apparel',
    description: 'Comfortable and durable jeans for everyday use.',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f6a8e8601614?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Running Sneakers',
    category: 'Shoes',
    description: 'Lightweight and breathable sneakers for long runs.',
    imageUrl: 'https://images.unsplash.com/photo-1579782558554-1b327b5e406f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Hiking Boots',
    category: 'Shoes',
    description: 'Sturdy hiking boots for rough terrain.',
    imageUrl: 'https://images.unsplash.com/photo-1563297184-e9185a703d1c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Gaming Keyboard',
    category: 'Electronics',
    description: 'Mechanical keyboard with customizable RGB lighting.',
    imageUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b28c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wireless Mouse',
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with a long battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1620023023078-450f37c35695?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Dining Table',
    category: 'Furniture',
    description: 'A modern dining table that seats six people.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c91ac641?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Living Room Sofa',
    category: 'Furniture',
    description: 'A comfortable three-seater sofa for your living room.',
    imageUrl: 'https://images.unsplash.com/photo-1618663248834-3112423377b2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Resistance Bands',
    category: 'Fitness',
    description: 'Set of resistance bands with different tensions.',
    imageUrl: 'https://images.unsplash.com/photo-1543666299-4c95f19069d6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Cycling Helmet',
    category: 'Fitness',
    description: 'Lightweight and ventilated helmet for safety.',
    imageUrl: 'https://images.unsplash.com/photo-1574763489851-912235c437a3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Silver Necklace',
    category: 'Accessories',
    description: 'A delicate silver necklace with a heart pendant.',
    imageUrl: 'https://images.unsplash.com/photo-1620324888127-1473216839a9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wristwatch',
    category: 'Accessories',
    description: 'A classic wristwatch with a stainless steel band.',
    imageUrl: 'https://images.unsplash.com/photo-1616422315750-61f67f7d4325?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wool Sweater',
    category: 'Apparel',
    description: 'A cozy wool sweater for cold weather.',
    imageUrl: 'https://images.unsplash.com/photo-1601614838640-1e5b8e968393?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Casual Hoodie',
    category: 'Apparel',
    description: 'A comfortable hoodie with a front pocket.',
    imageUrl: 'https://images.unsplash.com/photo-1582260654067-eb9568770281?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Loafers',
    category: 'Shoes',
    description: 'Stylish slip-on loafers for a relaxed look.',
    imageUrl: 'https://images.unsplash.com/photo-1595952864115-3de45814040f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'High-Top Sneakers',
    category: 'Shoes',
    description: 'Iconic high-top sneakers with a durable build.',
    imageUrl: 'https://images.unsplash.com/photo-1620023023078-450f37c35695?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Portable Speaker',
    category: 'Electronics',
    description: 'A compact and powerful speaker with Bluetooth connectivity.',
    imageUrl: 'https://images.unsplash.com/photo-1583758362624-954f28c2e6f4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Tablet',
    category: 'Electronics',
    description: 'A high-resolution tablet for work and entertainment.',
    imageUrl: 'https://images.unsplash.com/photo-1625455644781-ff05f564f208?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Bookshelf',
    category: 'Furniture',
    description: 'A tall wooden bookshelf with multiple shelves.',
    imageUrl: 'https://images.unsplash.com/photo-1592350798606-25805561330b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Bed Frame',
    category: 'Furniture',
    description: 'A sturdy bed frame with a minimalist design.',
    imageUrl: 'https://images.unsplash.com/photo-1549576495-3b4260907106?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Jump Rope',
    category: 'Fitness',
    description: 'Adjustable jump rope for cardio workouts.',
    imageUrl: 'https://images.unsplash.com/photo-1622909415510-a29d5b4d792e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Exercise Bike',
    category: 'Fitness',
    description: 'Stationary exercise bike for indoor cycling.',
    imageUrl: 'https://images.unsplash.com/photo-1616422315750-61f67f7d4325?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Sunglasses',
    category: 'Accessories',
    description: 'Stylish sunglasses with UV protection.',
    imageUrl: 'https://images.unsplash.com/photo-1620324888127-1473216839a9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Travel Backpack',
    category: 'Accessories',
    description: 'A durable backpack with multiple compartments.',
    imageUrl: 'https://images.unsplash.com/photo-1543087900-51c0d5174577?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Winter Coat',
    category: 'Apparel',
    description: 'A warm winter coat to brave the cold.',
    imageUrl: 'https://images.unsplash.com/photo-1549576495-3b4260907106?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Polo Shirt',
    category: 'Apparel',
    description: 'A casual polo shirt for a smart look.',
    imageUrl: 'https://images.unsplash.com/photo-1563297184-e9185a703d1c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Summer Sandals',
    category: 'Shoes',
    description: 'Comfortable and durable sandals for summer.',
    imageUrl: 'https://images.unsplash.com/photo-1592350798606-25805561330b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Formal Shoes',
    category: 'Shoes',
    description: 'Polished formal shoes for special events.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c91ac641?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'High-Performance Laptop',
    category: 'Electronics',
    description: 'A high-performance laptop for professional use.',
    imageUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b28c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Digital Camera',
    category: 'Electronics',
    description: 'A compact digital camera with a high-resolution sensor.',
    imageUrl: 'https://images.unsplash.com/photo-1566150995172-13271f20ac34?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Kitchen Table',
    category: 'Furniture',
    description: 'A sturdy kitchen table for everyday meals.',
    imageUrl: 'https://images.unsplash.com/photo-1616422315750-61f67f7d4325?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Dresser',
    category: 'Furniture',
    description: 'A wooden dresser with six spacious drawers.',
    imageUrl: 'https://images.unsplash.com/photo-1583758362624-954f28c2e6f4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Treadmill',
    category: 'Fitness',
    description: 'A robust treadmill with pre-set workout programs.',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f6a8e8601614?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Foam Roller',
    category: 'Fitness',
    description: 'A dense foam roller for muscle recovery and deep tissue massage.',
    imageUrl: 'https://images.unsplash.com/photo-1549576495-3b4260907106?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Scarf',
    category: 'Accessories',
    description: 'A soft scarf with a beautiful pattern.',
    imageUrl: 'https://images.unsplash.com/photo-1620324888127-1473216839a9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Wallet',
    category: 'Accessories',
    description: 'A compact leather wallet with multiple card slots.',
    imageUrl: 'https://images.unsplash.com/photo-1563297184-e9185a703d1c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Lightweight Jacket',
    category: 'Apparel',
    description: 'A lightweight jacket suitable for all seasons.',
    imageUrl: 'https://images.unsplash.com/photo-1598033106883-9b48695029e2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Casual Shorts',
    category: 'Apparel',
    description: 'Casual shorts for warm weather.',
    imageUrl: 'https://images.unsplash.com/photo-1618663248834-3112423377b2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Formal Trousers',
    category: 'Apparel',
    description: 'Tailored trousers for formal or business attire.',
    imageUrl: 'https://images.unsplash.com/photo-1543087900-51c0d5174577?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Loafers',
    category: 'Shoes',
    description: 'Classic leather loafers.',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa9b47e800?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Sneakers',
    category: 'Shoes',
    description: 'Casual sneakers.',
    imageUrl: 'https://images.unsplash.com/photo-1595952864115-3de45814040f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Smart Speaker',
    category: 'Electronics',
    description: 'A compact and powerful speaker with smart features.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-ce6c5d63f739?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Modern Tablet',
    category: 'Electronics',
    description: 'A high-resolution tablet for work and entertainment.',
    imageUrl: 'https://images.unsplash.com/photo-1620706240097-40c21087d03a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wooden Bookshelf',
    category: 'Furniture',
    description: 'A tall wooden bookshelf with multiple shelves.',
    imageUrl: 'https://images.unsplash.com/photo-1582260654067-eb9568770281?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Ergonomic Chair',
    category: 'Furniture',
    description: 'A comfortable chair for your living room.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c91ac641?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'T-Shirt',
    category: 'Apparel',
    description: 'A simple T-Shirt.',
    imageUrl: 'https://images.unsplash.com/photo-1543087900-51c0d5174577?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Sports Shoes',
    category: 'Shoes',
    description: 'Lightweight shoes for sports.',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa9b47e800?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Formal Trousers',
    category: 'Apparel',
    description: 'Tailored trousers for formal or business attire.',
    imageUrl: 'https://images.unsplash.com/photo-1543087900-51c0d5174577?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Sports T-Shirt',
    category: 'Apparel',
    description: 'A moisture-wicking sports t-shirt.',
    imageUrl: 'https://images.unsplash.com/photo-1543087900-51c0d5174577?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Running Shorts',
    category: 'Apparel',
    description: 'Lightweight shorts for running and workouts.',
    imageUrl: 'https://images.unsplash.com/photo-1543087900-51c0d5174577?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Suede Loafers',
    category: 'Shoes',
    description: 'Comfortable suede loafers.',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa9b47e800?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Casual Shoes',
    category: 'Shoes',
    description: 'Everyday shoes for a casual look.',
    imageUrl: 'https://images.unsplash.com/photo-1595952864115-3de45814040f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wireless Earbuds',
    category: 'Electronics',
    description: 'Compact wireless earbuds with great sound.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-ce6c5d63f739?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Action Camera',
    category: 'Electronics',
    description: 'A rugged action camera for outdoor adventures.',
    imageUrl: 'https://images.unsplash.com/photo-1620706240097-40c21087d03a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Console Table',
    category: 'Furniture',
    description: 'A narrow table for hallways and entryways.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c91ac641?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Chaise Lounge',
    category: 'Furniture',
    description: 'A comfortable chair for relaxation.',
    imageUrl: 'https://images.unsplash.com/photo-1618663248834-3112423377b2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Resistance Loop Bands',
    category: 'Fitness',
    description: 'A set of loop bands for strength training.',
    imageUrl: 'https://images.unsplash.com/photo-1543666299-4c95f19069d6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Running Watch',
    category: 'Fitness',
    description: 'A GPS running watch with heart rate monitor.',
    imageUrl: 'https://images.unsplash.com/photo-1622909415510-a29d5b4d792e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Aviator Sunglasses',
    category: 'Accessories',
    description: 'Classic aviator sunglasses with a gold frame.',
    imageUrl: 'https://images.unsplash.com/photo-1620324888127-1473216839a9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Backpack',
    category: 'Accessories',
    description: 'A stylish leather backpack for daily use.',
    imageUrl: 'https://images.unsplash.com/photo-1543087900-51c0d5174577?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Down Jacket',
    category: 'Apparel',
    description: 'A warm down jacket to brave the cold.',
    imageUrl: 'https://images.unsplash.com/photo-1549576495-3b4260907106?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Dress Shirt',
    category: 'Apparel',
    description: 'A crisp, professional dress shirt.',
    imageUrl: 'https://images.unsplash.com/photo-1563297184-e9185a703d1c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Hiking Sandals',
    category: 'Shoes',
    description: 'Durable sandals for summer hiking.',
    imageUrl: 'https://images.unsplash.com/photo-1592350798606-25805561330b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Oxford Shoes',
    category: 'Shoes',
    description: 'Classic leather Oxford shoes.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c91ac641?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Gaming Laptop',
    category: 'Electronics',
    description: 'A high-performance gaming laptop.',
    imageUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b28c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'DSLR Camera',
    category: 'Electronics',
    description: 'A professional DSLR camera for photography.',
    imageUrl: 'https://images.unsplash.com/photo-1566150995172-13271f20ac34?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wooden Kitchen Table',
    category: 'Furniture',
    description: 'A sturdy kitchen table for everyday meals.',
    imageUrl: 'https://images.unsplash.com/photo-1616422315750-61f67f7d4325?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Nightstand',
    category: 'Furniture',
    description: 'A wooden nightstand with a single drawer.',
    imageUrl: 'https://images.unsplash.com/photo-1583758362624-954f28c2e6f4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Foam Rollers',
    category: 'Fitness',
    description: 'A set of foam rollers for muscle recovery.',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f6a8e8601614?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Exercise Bands',
    category: 'Fitness',
    description: 'A set of exercise bands for a full-body workout.',
    imageUrl: 'https://images.unsplash.com/photo-1549576495-3b4260907106?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Ray-Ban Sunglasses',
    category: 'Accessories',
    description: 'Classic Ray-Ban sunglasses.',
    imageUrl: 'https://images.unsplash.com/photo-1620324888127-1473216839a9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Wallet',
    category: 'Accessories',
    description: 'A compact leather wallet with multiple card slots.',
    imageUrl: 'https://images.unsplash.com/photo-1563297184-e9185a703d1c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Lightweight Jacket',
    category: 'Apparel',
    description: 'A lightweight jacket suitable for all seasons.',
    imageUrl: 'https://images.unsplash.com/photo-1598033106883-9b48695029e2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Running Shorts',
    category: 'Apparel',
    description: 'Casual shorts for warm weather.',
    imageUrl: 'https://images.unsplash.com/photo-1543087900-51c0d5174577?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Trousers',
    category: 'Apparel',
    description: 'Tailored trousers for formal or business attire.',
    imageUrl: 'https://images.unsplash.com/photo-1543087900-51c0d5174577?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Jacket',
    category: 'Apparel',
    description: 'A classic leather jacket.',
    imageUrl: 'https://images.unsplash.com/photo-1543087900-51c0d5174577?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Black T-Shirt',
    category: 'Apparel',
    description: 'A minimalist black tee.',
    imageUrl: 'https://images.unsplash.com/photo-1620023023078-450f37c35695?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'White Running Shoes',
    category: 'Shoes',
    description: 'Lightweight white running shoes.',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa9b47e800?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Casual Sneakers',
    category: 'Shoes',
    description: 'Comfortable casual sneakers.',
    imageUrl: 'https://images.unsplash.com/photo-1595952864115-3de45814040f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
];


// Placeholder function to generate a random feature vector
// In a real application, this would be a call to an AI service
const generateRandomFeatureVector = () => {
    // A common vector size is 128 or 256. We will use 128 for this simulation.
    const vector = [];
    for (let i = 0; i < 128; i++) {
        vector.push(Math.random());
    }
    return vector;
};

const importData = async () => {
  try {
    await connectDB(MONGO_URI);

    // Clear existing data
    await Product.deleteMany();

    console.log('Existing data cleared.');

    // Add a feature vector to each product before inserting
    const productsWithVectors = sampleProducts.map(product => ({
        ...product,
        featureVector: generateRandomFeatureVector()
    }));

    // Corrected line: Insert new products with their feature vectors
    await Product.insertMany(productsWithVectors);
    console.log('Products inserted.');

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB(MONGO_URI);

    await Product.deleteMany();
    await User.deleteMany();

    console.log('All data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}