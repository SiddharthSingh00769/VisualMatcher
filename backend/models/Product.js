import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
