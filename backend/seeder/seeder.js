import dotenv from 'dotenv';
import path from 'path'; 
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import User from '../models/User.js';
import connectDB from '../db/connect.js';
import { getVectorFromImage, keywordMapping } from '../controllers/productController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
    imageUrl: 'https://images.unsplash.com/photo-1638803782506-d975a6809f43?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Smart Watch',
    category: 'Electronics',
    description: 'A stylish smart watch with health tracking features.',
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Modern Coffee Table',
    category: 'Furniture',
    description: 'A sleek, modern coffee table made of polished wood.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1681487762009-6c81a476c607?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Executive Office Chair',
    category: 'Furniture',
    description: 'Ergonomic chair for maximum comfort during long work hours.',
    imageUrl: 'https://media.istockphoto.com/id/875326344/photo/black-office-chair.jpg?s=2048x2048&w=is&k=20&c=F7tDFbQoW36tbp12UJ2Hucnjo2bphmcugrssjoNJ4rg='
  },
  {
    name: 'Yoga Mat',
    category: 'Fitness',
    description: 'Non-slip yoga mat for a perfect grip.',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Fitness Dumbbells',
    category: 'Fitness',
    description: 'Adjustable dumbbell set for a full-body workout.',
    imageUrl: 'https://images.unsplash.com/photo-1609674248079-e9242e48c06b?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Elegant Handbag',
    category: 'Accessories',
    description: 'A luxurious handbag for a touch of elegance.',
    imageUrl: 'https://images.unsplash.com/photo-1743324690280-62c0699f46d2?q=80&w=850&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Belt',
    category: 'Accessories',
    description: 'A high-quality leather belt that complements any outfit.',
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Formal Dress Shirt',
    category: 'Apparel',
    description: 'A crisp formal shirt for professional settings.',
    imageUrl: 'https://images.unsplash.com/photo-1602810318660-d2c46b750f88?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Slim Fit Jeans',
    category: 'Apparel',
    description: 'Comfortable and durable jeans for everyday use.',
    imageUrl: 'https://images.unsplash.com/photo-1542574621-e088a4464f7e?q=80&w=680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Running Sneakers',
    category: 'Shoes',
    description: 'Lightweight and breathable sneakers for long runs.',
    imageUrl: 'https://images.unsplash.com/photo-1709258228137-19a8c193be39?q=80&w=811&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Hiking Boots',
    category: 'Shoes',
    description: 'Sturdy hiking boots for rough terrain.',
    imageUrl: 'https://images.unsplash.com/photo-1698763954905-c9b24f40134f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Gaming Keyboard',
    category: 'Electronics',
    description: 'Mechanical keyboard with customizable RGB lighting.',
    imageUrl: 'https://images.unsplash.com/photo-1626155399627-86488538895d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wireless Mouse',
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with a long battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1028&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Dining Table',
    category: 'Furniture',
    description: 'A modern dining table that seats six people.',
    imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=804&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Living Room Sofa',
    category: 'Furniture',
    description: 'A comfortable three-seater sofa for your living room.',
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Resistance Bands',
    category: 'Fitness',
    description: 'Set of resistance bands with different tensions.',
    imageUrl: 'https://images.unsplash.com/photo-1515775538093-d2d95c5ee4f5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Cycling Helmet',
    category: 'Fitness',
    description: 'Lightweight and ventilated helmet for safety.',
    imageUrl: 'https://images.unsplash.com/photo-1701522814811-532e0ce6ef74?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Silver Necklace',
    category: 'Accessories',
    description: 'A delicate silver necklace with a heart pendant.',
    imageUrl: 'https://images.unsplash.com/photo-1676329947145-99145926d3eb?q=80&w=979&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wristwatch',
    category: 'Accessories',
    description: 'A classic wristwatch with a stainless steel band.',
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wool Sweater',
    category: 'Apparel',
    description: 'A cozy wool sweater for cold weather.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1671135590215-ded219822a44?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Casual Hoodie',
    category: 'Apparel',
    description: 'A comfortable hoodie with a front pocket.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1690341214258-18cb88438805?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Loafers',
    category: 'Shoes',
    description: 'Stylish slip-on loafers for a relaxed look.',
    imageUrl: 'https://images.unsplash.com/photo-1616406432452-07bc5938759d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'High-Top Sneakers',
    category: 'Shoes',
    description: 'Iconic high-top sneakers with a durable build.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1723773743655-71e6b5961089?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Portable Speaker',
    category: 'Electronics',
    description: 'A compact and powerful speaker with Bluetooth connectivity.',
    imageUrl: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Tablet',
    category: 'Electronics',
    description: 'A high-resolution tablet for work and entertainment.',
    imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Bookshelf',
    category: 'Furniture',
    description: 'A tall wooden bookshelf with multiple shelves.',
    imageUrl: 'https://images.unsplash.com/photo-1559133082-d15e8502d064?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Bed Frame',
    category: 'Furniture',
    description: 'A sturdy bed frame with a minimalist design.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1667764824866-20cf3f787402?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Jump Rope',
    category: 'Fitness',
    description: 'Adjustable jump rope for cardio workouts.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1664529498751-9bcd541edb9f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Exercise Bike',
    category: 'Fitness',
    description: 'Stationary exercise bike for indoor cycling.',
    imageUrl: 'https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Sunglasses',
    category: 'Accessories',
    description: 'Stylish sunglasses with UV protection.',
    imageUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Travel Backpack',
    category: 'Accessories',
    description: 'A durable backpack with multiple compartments.',
    imageUrl: 'https://images.unsplash.com/photo-1575844264771-892081089af5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Winter Coat',
    category: 'Apparel',
    description: 'A warm winter coat to brave the cold.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1671030274122-b6ac34f87b8b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Polo Shirt',
    category: 'Apparel',
    description: 'A casual polo shirt for a smart look.',
    imageUrl: 'https://images.unsplash.com/photo-1625910513399-c9fcba54338c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Summer Sandals',
    category: 'Shoes',
    description: 'Comfortable and durable sandals for summer.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1720760950538-49750a883027?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Formal Shoes',
    category: 'Shoes',
    description: 'Polished formal shoes for special events.',
    imageUrl: 'https://images.unsplash.com/photo-1668069226492-508742b03147?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'High-Performance Laptop',
    category: 'Electronics',
    description: 'A high-performance laptop for professional use.',
    imageUrl: 'https://images.unsplash.com/photo-1694278963820-eaf19e9fb646?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Digital Camera',
    category: 'Electronics',
    description: 'A compact digital camera with a high-resolution sensor.',
    imageUrl: 'https://images.unsplash.com/photo-1698502453332-03fa2ddceb71?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Kitchen Table',
    category: 'Furniture',
    description: 'A sturdy kitchen table for everyday meals.',
    imageUrl: 'https://images.unsplash.com/photo-1609210885628-4c6a41a8caf7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Dresser',
    category: 'Furniture',
    description: 'A wooden dresser with six spacious drawers.',
    imageUrl: 'https://images.unsplash.com/photo-1579283111509-855c7eea1c49?q=80&w=694&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Treadmill',
    category: 'Fitness',
    description: 'A robust treadmill with pre-set workout programs.',
    imageUrl: 'https://images.unsplash.com/photo-1652364653960-1c23c208ef43?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Foam Roller',
    category: 'Fitness',
    description: 'A dense foam roller for muscle recovery and deep tissue massage.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1661923103649-0223557b8589?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Scarf',
    category: 'Accessories',
    description: 'A soft scarf with a beautiful pattern.',
    imageUrl: 'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Wallet',
    category: 'Accessories',
    description: 'A compact leather wallet with multiple card slots.',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Lightweight Jacket',
    category: 'Apparel',
    description: 'A lightweight jacket suitable for all seasons.',
    imageUrl: 'https://images.unsplash.com/photo-1648111145022-1af83031ade6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Casual Shorts',
    category: 'Apparel',
    description: 'Casual shorts for warm weather.',
    imageUrl: 'https://images.unsplash.com/photo-1695918428860-a3bc6a2f1d4b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Formal Trousers',
    category: 'Apparel',
    description: 'Tailored trousers for formal or business attire.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1689977493146-ed929d07d97e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Loafers',
    category: 'Shoes',
    description: 'Classic leather loafers.',
    imageUrl: 'https://images.unsplash.com/photo-1615979474401-8a6a344de5bd?q=80&w=881&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Sneakers',
    category: 'Shoes',
    description: 'Casual sneakers.',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Smart Speaker',
    category: 'Electronics',
    description: 'A compact and powerful speaker with smart features.',
    imageUrl: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Modern Tablet',
    category: 'Electronics',
    description: 'A high-resolution tablet for work and entertainment.',
    imageUrl: 'https://images.unsplash.com/photo-1691973172023-1667332f269e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wooden Bookshelf',
    category: 'Furniture',
    description: 'A tall wooden bookshelf with multiple shelves.',
    imageUrl: 'https://images.unsplash.com/photo-1730165867812-913d003b75c2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Ergonomic Chair',
    category: 'Furniture',
    description: 'A comfortable chair for your living room.',
    imageUrl: 'https://images.unsplash.com/photo-1688578735352-9a6f2ac3b70a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'T-Shirt',
    category: 'Apparel',
    description: 'A simple T-Shirt.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Sports Shoes',
    category: 'Shoes',
    description: 'Lightweight shoes for sports.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Formal Trousers',
    category: 'Apparel',
    description: 'Tailored trousers for formal or business attire.',
    imageUrl: 'https://images.unsplash.com/photo-1594938252461-e42450664907?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Sports T-Shirt',
    category: 'Apparel',
    description: 'A moisture-wicking sports t-shirt.',
    imageUrl: 'https://images.unsplash.com/photo-1516177609387-9bad55a45194?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Running Shorts',
    category: 'Apparel',
    description: 'Lightweight shorts for running and workouts.',
    imageUrl: 'https://images.unsplash.com/photo-1695918425801-41dd27ed8277?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Suede Loafers',
    category: 'Shoes',
    description: 'Comfortable suede loafers.',
    imageUrl: 'https://images.unsplash.com/photo-1576792741377-eb0f4f6d1a47?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Casual Shoes',
    category: 'Shoes',
    description: 'Everyday shoes for a casual look.',
    imageUrl: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=1131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wireless Earbuds',
    category: 'Electronics',
    description: 'Compact wireless earbuds with great sound.',
    imageUrl: 'https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Action Camera',
    category: 'Electronics',
    description: 'A rugged action camera for outdoor adventures.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1710961233810-5350d81d4b20?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Console Table',
    category: 'Furniture',
    description: 'A narrow table for hallways and entryways.',
    imageUrl: 'https://images.unsplash.com/photo-1752061289739-1f09db643ffe?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Chaise Lounge',
    category: 'Furniture',
    description: 'A comfortable chair for relaxation.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1683888725032-77a464b20a68?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Resistance Loop Bands',
    category: 'Fitness',
    description: 'A set of loop bands for strength training.',
    imageUrl: 'https://images.unsplash.com/photo-1751846545116-838fe2e7e815?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Running Watch',
    category: 'Fitness',
    description: 'A GPS running watch with heart rate monitor.',
    imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Aviator Sunglasses',
    category: 'Accessories',
    description: 'Classic aviator sunglasses with a gold frame.',
    imageUrl: 'https://images.unsplash.com/photo-1622340191833-8df724e850c0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Backpack',
    category: 'Accessories',
    description: 'A stylish leather backpack for daily use.',
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Down Jacket',
    category: 'Apparel',
    description: 'A warm down jacket to brave the cold.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1670623042512-1a5ecebc3f42?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Dress Shirt',
    category: 'Apparel',
    description: 'A crisp, professional dress shirt.',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Hiking Sandals',
    category: 'Shoes',
    description: 'Durable sandals for summer hiking.',
    imageUrl: 'https://images.unsplash.com/photo-1625318880712-b28ec65ddfa1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Oxford Shoes',
    category: 'Shoes',
    description: 'Classic leather Oxford shoes.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1664790560167-5160505f1596?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Gaming Laptop',
    category: 'Electronics',
    description: 'A high-performance gaming laptop.',
    imageUrl: 'https://images.unsplash.com/photo-1658262530868-f7460e2f071f?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'DSLR Camera',
    category: 'Electronics',
    description: 'A professional DSLR camera for photography.',
    imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Wooden Kitchen Table',
    category: 'Furniture',
    description: 'A sturdy kitchen table for everyday meals.',
    imageUrl: 'https://images.unsplash.com/photo-1687949289431-7dbbef0f872f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Nightstand',
    category: 'Furniture',
    description: 'A wooden nightstand with a single drawer.',
    imageUrl: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Foam Rollers',
    category: 'Fitness',
    description: 'A set of foam rollers for muscle recovery.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1666736569451-121617facc47?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Exercise Bands',
    category: 'Fitness',
    description: 'A set of exercise bands for a full-body workout.',
    imageUrl: 'https://images.unsplash.com/photo-1585475686930-8fcb2728eb6b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Ray-Ban Sunglasses',
    category: 'Accessories',
    description: 'Classic Ray-Ban sunglasses.',
    imageUrl: 'https://images.unsplash.com/photo-1695057221246-3ab8a2ff5bf2?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Wallet',
    category: 'Accessories',
    description: 'A compact leather wallet with multiple card slots.',
    imageUrl: 'https://images.unsplash.com/photo-1620109176813-e91290f6c795?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Lightweight Jacket',
    category: 'Apparel',
    description: 'A lightweight jacket suitable for all seasons.',
    imageUrl: 'https://images.unsplash.com/photo-1557418669-db3f781a58c0?q=80&w=697&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Running Shorts',
    category: 'Apparel',
    description: 'Casual shorts for warm weather.',
    imageUrl: 'https://images.unsplash.com/photo-1695918428487-7934244c19ac?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Trousers',
    category: 'Apparel',
    description: 'Tailored trousers for formal or business attire.',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=697&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Leather Jacket',
    category: 'Apparel',
    description: 'A classic leather jacket.',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Black T-Shirt',
    category: 'Apparel',
    description: 'A minimalist black tee.',
    imageUrl: 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'White Running Shoes',
    category: 'Shoes',
    description: 'Lightweight white running shoes.',
    imageUrl: 'https://images.unsplash.com/photo-1698018574308-929deec9f832?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Casual Sneakers',
    category: 'Shoes',
    description: 'Comfortable casual sneakers.',
    imageUrl: 'https://images.unsplash.com/photo-1612942910539-9ff28b2e00d3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Bomber Jacket',
    category: 'Apparel',
    description: 'A stylish bomber jacket with ribbed cuffs and hem.',
    imageUrl: 'https://imgs.search.brave.com/DixZJKV7SVvLJa91bm3Q8TjOQSk-1caBZBNNYGWh6v4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFCZ09RZG1LZ0wu/anBn'
  },
  {
    name: 'Graphic Hoodie',
    category: 'Apparel',
    description: 'Casual hoodie with a bold graphic print on the front.',
    imageUrl: 'https://imgs.search.brave.com/b2eXV4qrAZMTMUaFv6VIRj2HVKufKEancao6klvm4t0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjEyYS00U2FNTUwu/anBn'
  },
  {
    name: 'Chelsea Boots',
    category: 'Shoes',
    description: 'Elegant ankle-high boots with elastic side panels.',
    imageUrl: 'https://imgs.search.brave.com/gvJ9yHZL3h6ZcLaHcZ78vMFdssrhQEVxlGdZ8QPpeI0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90YWZ0/Y2xvdGhpbmcuY29t/L2Nkbi9zaG9wL3By/b2R1Y3RzL1RhZnRf/T25XaGl0ZV8yMDE5/MTExNF8yNjQ1LW1p/bi5qcGc_dj0xNzQ1/MzY1MjU3JndpZHRo/PTgwMA'
  },
  {
    name: 'Trail Running Shoes',
    category: 'Shoes',
    description: 'Durable trail running shoes with excellent grip.',
    imageUrl: 'https://imgs.search.brave.com/KQ5L_wJX9_0abq4z1cQsYf5FDKzQsfhpLw7Omfg0Nys/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zMy5h/bWF6b25hd3MuY29t/L3d3dy5pcnVuZmFy/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNS8wMi8xNzE5/MTIwMS9iZXN0LXRy/YWlsLXJ1bm5pbmct/c2hvZXMtU2F1Y29u/eS1QZXJlZ3JpbmUt/MTUtMS5qcGc'
  },
  {
    name: 'Noise-Cancelling Headphones',
    category: 'Electronics',
    description: 'Over-ear headphones with active noise cancellation.',
    imageUrl: 'https://imgs.search.brave.com/bLRDiDFUQQQfXFslsSjGBtpQqMsA_AYNWpsYXKLHR0Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dGhld2lyZWN1dHRl/ci5jb20vd3AtY29u/dGVudC9tZWRpYS8y/MDI1LzA2L0JFU1Qt/Tk9JU0UtQ0FOQ0VM/TElORy1IRUFEUEhP/TkVTLTgyNTMuanBn'
  },
  {
    name: 'Fitness Tracker',
    category: 'Electronics',
    description: 'Track your daily activity, heart rate, and sleep patterns.',
    imageUrl: 'https://imgs.search.brave.com/UCGQLHrP52HLhmtXCLDOOFfrXwEmx8qUOBwEfmmtNXY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dGhld2lyZWN1dHRl/ci5jb20vd3AtY29u/dGVudC9tZWRpYS8y/MDIzLzExL2ZpdG5l/c3MtdHJhY2tlci0y/MDQ4cHgtNTM0OC5q/cGc_YXV0bz13ZWJw/JnF1YWxpdHk9NzUm/d2lkdGg9MTAyNA'
  },
  {
    name: 'Accent Chair',
    category: 'Furniture',
    description: 'A modern accent chair for your living room or bedroom.',
    imageUrl: 'https://imgs.search.brave.com/sN_D3RoV3hIGJneqP8P4-APxdAEVPp5D2o_xT6GI52w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuemFyYWhvbWUu/bmV0L2Fzc2V0cy9w/dWJsaWMvMjI0Ni8z/OTI0LzUzNTA0OTYy/YTIwYi8wODYxNGMx/ODM2ZTYvNDQxNDEw/NzMwNTItYTcvNDQx/NDEwNzMwNTItYTcu/anBnP3RzPTE3NDQy/ODIxMzI2MzkmZj1h/dXRvJnc9MzQy'
  },
  {
    name: 'Bar Stool',
    category: 'Furniture',
    description: 'Minimalist bar stool with a sturdy wooden frame.',
    imageUrl: 'https://imgs.search.brave.com/IpPUWVrQ5sL2NDTaUiRS5158f6NaW_AitplvweS91hg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMud2ZjZG4uY29t/L2ltLzk0NzU3MDI0/L3Jlc2l6ZS1oNDAw/LXc0MDBeY29tcHIt/cjg1LzExMTAvMTEx/MDM5MDYyL0FkZWxp/dGErTW9kZXJuK1N3/aXZlbCtDb3VudGVy/K29yK0JhcitIZWln/aHQrQmFyK1N0b29s/K3dpdGgrQXJtcytp/bitGYXV4K0xlYXRo/ZXIsK2FuZCtNZXRh/bCtGcmFtZS5qcGc'
  },
  {
    name: 'Kettlebell Set',
    category: 'Fitness',
    description: 'A set of kettlebells with varying weights for strength training.',
    imageUrl: 'https://imgs.search.brave.com/Y4M6S7y23-VKmeHbmD565ExjXhyJGRiMdUPcHCEyZGo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE0LzUzLzQ5LzU4/LzM2MF9GXzE0NTM0/OTU4NDBfZTA3UXJa/eXNnSUQzV3dobGhm/MHNsSGRndWc4ekNJ/MFkuanBn'
  },
  {
    name: 'Pull-Up Bar',
    category: 'Fitness',
    description: 'Sturdy pull-up bar for home workouts and strength training.',
    imageUrl: 'https://imgs.search.brave.com/GYGSjLKn5Qo5fIqze2lSHGTqperLwoiFM40oU1-Ty7g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFUcEQ0V1hsd0wu/anBn'
  },
  {
    name: 'Bucket Hat',
    category: 'Accessories',
    description: 'Trendy bucket hat perfect for sunny days.',
    imageUrl: 'https://imgs.search.brave.com/H3wAOj7DK9DED0UI6KbJMu2rpIP0ARzYbxGHZzfCOh4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzExLzEzLzI4Lzg2/LzM2MF9GXzExMTMy/ODg2MDhfNFBtTm5y/aWFUV3ozdHY2Vkc4/cUFZMnlHeGdFWmdH/TncuanBn'
  },
  {
    name: 'Canvas Tote Bag',
    category: 'Accessories',
    description: 'Eco-friendly canvas tote bag for everyday use.',
    imageUrl: 'https://imgs.search.brave.com/c7YqGpwle_bUeP4jeyZN-HSI-FrAdl858yxCa_CQMPk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzVj/ZjFjZTU0MTgwN2Q2/MDAwMTJiZWQzMC8x/NTg4MzcyMDI1MDQ4/LVI4Qzg0M042MTNE/UFIzS0kzWFNWL0Jl/Y2tlbGNhbnZhczQ4/Mzg1LmpwZw'
  }
];

const importData = async () => {
  try {
    await connectDB(MONGO_URI);

    // Clear existing data
    await Product.deleteMany();

    console.log('Existing data cleared.');

    // Get the feature vector for each product before inserting
    console.log('Generating feature vectors for products...');
    const productsWithVectors = [];
    for (const product of sampleProducts) {
      try {
        const featureVector = await getVectorFromImage(product.imageUrl);
        productsWithVectors.push({ ...product, featureVector });
        console.log(`Generated vector for ${product.name}. Waiting to avoid rate limits...`);
        // Introduced a delay to avoid hitting the rate limit (15 requests/min)
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (err) {
        console.error(`Failed to generate vector for ${product.name}:`, err.message);
        productsWithVectors.push({ ...product, featureVector: [] });
      }
    }
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