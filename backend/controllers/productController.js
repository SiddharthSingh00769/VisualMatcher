import Product from '../models/Product.js';

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
        // This is a temporary solution to make the search dynamic before implementing AI/ML.
        // It extracts the product name from the placeholder image URL and uses it as a search query.
        const imageName = image.split('?text=')[1];
        let category = 'Unknown';
        if (imageName) {
          // Remove '+' characters and capitalize the first letter of each word to match categories
          const formattedName = imageName.split('+').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          
          // Now, we'll try to guess a category from the name.
          // This is a simple, non-AI logic to make the search more meaningful for now.
          if (formattedName.includes('Shirt') || formattedName.includes('Jacket') || formattedName.includes('Hoodie') || formattedName.includes('Jeans') || formattedName.includes('Trousers')) {
            category = 'Apparel';
          } else if (formattedName.includes('Shoes') || formattedName.includes('Sneakers') || formattedName.includes('Loafers')) {
            category = 'Shoes';
          } else if (formattedName.includes('Headphones') || formattedName.includes('Watch') || formattedName.includes('Camera') || formattedName.includes('Laptop') || formattedName.includes('Mouse') || formattedName.includes('Keyboard') || formattedName.includes('Speaker') || formattedName.includes('Tablet')) {
            category = 'Electronics';
          } else if (formattedName.includes('Table') || formattedName.includes('Chair') || formattedName.includes('Sofa') || formattedName.includes('Bookshelf') || formattedName.includes('Dresser')) {
            category = 'Furniture';
          } else if (formattedName.includes('Yoga') || formattedName.includes('Dumbbells') || formattedName.includes('Roller') || formattedName.includes('Treadmill') || formattedName.includes('Helmet')) {
            category = 'Fitness';
          } else if (formattedName.includes('Handbag') || formattedName.includes('Belt') || formattedName.includes('Necklace') || formattedName.includes('Sunglasses') || formattedName.includes('Backpack') || formattedName.includes('Scarf')) {
            category = 'Accessories';
          }
        }
        
        // Find products that match the determined category.
        const similarProducts = await Product.find({ category }).limit(10);

        res.json({
            message: 'Search received. This is a placeholder response.',
            queryImage: image,
            similarProducts: similarProducts,
        });

    } catch (err) {
        console.error('Error during search:', err.message);
        res.status(500).json({ error: 'Server error during search' });
    }
};
