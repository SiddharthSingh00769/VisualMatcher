// File: backend/controllers/productController.js
// Description: This file contains the logic for product-related operations.

import Product from '../models/Product.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '../.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Function to calculate cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

// Keyword mapping for synonyms
export const keywordMapping = {
  // High-priority product types (weight: 3)
  shoes: ['shoes', 'footwear', 'sneakers', 'trainers', 'loafers', 'sandals', 'heels', 'flats', 'slippers', 'mules', 'pumps', 'wedges', 'flip-flops', 'boots', 'espadrilles', 'derbies', 'oxfords', 'brogues', 'platforms', 'running-shoes', 'dress-shoes', 'high-tops', 'low-tops', 'chukka-boots', 'chelsea-boots', 'clogs', 'boat-shoes', 'huaraches', 'mary-janes', 'moccasins', 'athletic-shoes', 'skate-shoes', 'work-boots', 'stilettos', 'ballet-flats', 'docksides', 'espadrilles', 'sneaker-boots', 'walking-shoes', 'hiking-shoes', 'water-shoes'],
  camera: ['camera', 'dslr', 'camcorder', 'webcam', 'lens', 'tripod', 'flash', 'gopro', 'drone', 'action-camera', 'mirrorless', 'point-and-shoot', 'instant-camera', 'digital-camera', 'film-camera', 'security-camera', 'dash-cam', '360-camera', 'telescope', 'microscope', 'binoculars', 'monocular', 'cctv-camera', 'spy-camera', 'trail-camera', 'video-camera', 'surveillance-camera', 'camcorder'],
  laptop: ['laptop', 'notebook', 'ultrabook', 'chromebook', 'macbook', 'pc', 'tablet', 'monitor', 'desktop', 'all-in-one', 'gaming-laptop', 'netbook', '2-in-1', 'convertible', 'workstation', 'server', 'mainframe', 'touchscreen-laptop', 'netbook'],
  watch: ['watch', 'wristwatch', 'smartwatch', 'chronograph', 'timepiece', 'band', 'fitness-tracker', 'pocket-watch', 'digital-watch', 'analog-watch', 'sports-watch', 'dive-watch', 'dress-watch', 'pilot-watch', 'field-watch', 'automatic-watch', 'quartz-watch', 'solar-watch', 'mechanical-watch', 'smart-band'],
  handbag: ['handbag', 'bag', 'purse', 'clutch', 'tote', 'satchel', 'backpack', 'messenger-bag', 'hobo', 'duffel', 'fanny-pack', 'briefcase', 'wallet', 'crossbody-bag', 'shoulder-bag', 'shopper', 'luggage', 'suitcase', 'cosmetic-bag', 'diaper-bag', 'weekender', 'trolley', 'briefcase', 'clutch-purse', 'evening-bag', 'bucket-bag', 'doctor-bag'],
  jacket: ['jacket', 'coat', 'parka', 'blazer', 'cardigan', 'anorak', 'vest', 'pullover', 'windbreaker', 'trench-coat', 'overcoat', 'hoodie', 'bomber-jacket', 'denim-jacket', 'leather-jacket', 'raincoat', 'down-jacket', 'puffer-jacket', 'peacoat', 'tuxedo-jacket', 'suit-jacket', 'varsity-jacket', 'poncho', 'cape', 'kimono', 'robe', 'motorcycle-jacket', 'track-jacket', 'fleece-jacket', 'anorak', 'field-jacket', 'waistcoat'],
  shirt: ['shirt', 't-shirt', 'polo-shirt', 'blouse', 'tunic', 'top', 'tank-top', 'tank', 'polo', 'sweatshirt', 'jersey', 'henley', 'dress-shirt', 'button-down', 'flannel', 'crewneck-shirt', 'v-neck-shirt', 'long-sleeve-shirt', 'short-sleeve-shirt', 'halter-top', 'tube-top', 'crop-top', 'bodysuit', 'camisole', 'shell-top', 'graphic-tee', 'raglan-shirt', 'rugby-shirt', 'henley-shirt', 'cowl-neck', 'mock-turtleneck'],

  // Broad product types (weight: 2)
  apparel: ['jeans', 'denim', 'trousers', 'leggings', 'cargos', 'chinos', 'khakis', 'slacks', 'pants', 'shorts', 'skirt', 'dress', 'romper', 'jumpsuit', 'overalls', 'suit', 'blouse', 'cardigan', 'sweater', 'hoodie', 'leggings', 'miniskirt', 'maxi-dress', 'midi-skirt', 'sundress', 'sweatpants', 'joggers', 'culottes', 'capris', 'pajamas', 'swimsuit', 'bikini', 'bra', 'underwear', 'socks', 'stockings', 'tie', 'belt', 'scarf', 'gloves', 'hat', 'cap', 'scarf', 'cravat', 'tights', 'stockings'],
  furniture: ['table', 'chair', 'sofa', 'bookshelf', 'bed', 'dresser', 'nightstand', 'desk', 'ottoman', 'cabinet', 'wardrobe', 'stool', 'bench', 'console', 'lounge', 'headboard', 'mattress', 'rug', 'lamp', 'mirror', 'console-table', 'coffee-table', 'side-table', 'pouf', 'futon', 'recliner', 'chaise-lounge', 'shelving', 'bar-stool', 'loveseat', 'sectional', 'armchair', 'patio-furniture', 'vanity', 'buffet', 'credenza', 'hutch', 'ottoman', 'bench', 'etagere', 'chaise', 'rocking-chair', 'high-chair', 'bean-bag', 'hammock', 'patio-set', 'bar-cart'],
  fitness: ['mat', 'dumbbells', 'bands', 'helmet', 'bike', 'treadmill', 'roller', 'rope', 'barbell', 'kettlebell', 'weights', 'gloves', 'towel', 'ball', 'elliptical', 'punching-bag', 'yoga-block', 'jump-rope', 'resistance-bands', 'stationary-bike', 'rowing-machine', 'workout-gloves', 'gym-bag', 'sports-bottle', 'exercise-ball', 'medicine-ball', 'pull-up-bar', 'ab-wheel', 'squat-rack', 'punching-gloves', 'weight-bench', 'spin-bike', 'stair-climber', 'yoga-strap', 'bosu-ball'],
  accessory: ['belt', 'necklace', 'wallet', 'backpack', 'scarf', 'sunglasses', 'ring', 'earrings', 'bracelet', 'hat', 'cap', 'gloves', 'tie', 'cufflinks', 'keychain', 'tie-clip', 'anklet', 'hair-pin', 'brooch', 'locket', 'tie-tack', 'bangle', 'pendant', 'choker', 'studs', 'hoops', 'fedora', 'beanie', 'visor', 'cravat', 'ascot', 'pocket-square', 'suspenders', 'cummerbund', 'bow-tie', 'headband', 'earmuffs', 'wristband', 'lanyard', 'charm'],
  electronics: ['headphones', 'earbuds', 'speaker', 'laptop', 'tablet', 'camera', 'keyboard', 'mouse', 'watch', 'monitor', 'phone', 'printer', 'webcam', 'microphone', 'drone', 'smart-home', 'router', 'modem', 'speakers', 'earphones', 'console', 'e-reader', 'power-bank', 'charger', 'projector', 'hard-drive', 'usb-drive', 'smart-light', 'smart-plug', 'gaming-console', 'tv', 'radio', 'blu-ray-player', 'dvd-player', 'fire-stick', 'roku', 'air-fryer', 'coffee-maker', 'toaster', 'blender', 'microwave', 'smart-bulb', 'smart-thermostat'],
  kitchenware: ['mug', 'bottle', 'cup', 'plate', 'bowl', 'utensils', 'glass', 'fork', 'spoon', 'knife', 'forks', 'spoons', 'knives', 'dishes', 'glasses', 'tumbler', 'pitcher', 'carafe', 'coaster', 'napkin', 'placemat', 'ceramic', 'porcelain', 'tea-pot', 'coffee-maker', 'blender', 'toaster', 'microwave', 'kettle', 'pan', 'pot', 'cutting-board', 'measuring-cups', 'spatula', 'whisk', 'tongs', 'ladle', 'strainer', 'colander', 'can-opener', 'wine-opener', 'corkscrew', 'grater', 'peeler', 'masher', 'rolling-pin', 'cookie-cutter', 'muffin-tin', 'baking-sheet', 'saucepan', 'frying-pan', 'sieve', 'colander', 'strainer', 'food-processor', 'mixer', 'juicer', 'griddle', 'wok', 'roaster'],

  // Attributes (weight: 1)
  material: ['denim', 'leather', 'wool', 'cotton', 'polyester', 'satin', 'knit', 'wood', 'metal', 'plastic', 'glass', 'velvet', 'corduroy', 'silk', 'linen', 'suede', 'mesh', 'twill', 'canvas', 'spandex', 'rayon', 'nylon', 'acrylic', 'stone', 'marble', 'wicker', 'rattan', 'bamboo', 'felt', 'jute', 'sequin', 'lace', 'neoprene', 'terry-cloth', 'chiffon', 'georgette', 'cashmere', 'mohair', 'velour', 'lycra', 'organza', 'tweed', 'flannel', 'terry-cloth', 'shearling', 'crepe', 'damask', 'brocade', 'organza', 'tulle', 'chambray', 'grosgrain', 'taffeta', 'boucle', 'chenille', 'herringbone'],
  color: ['red', 'blue', 'green', 'black', 'brown', 'gray', 'silver', 'gold', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'teal', 'navy', 'maroon', 'beige', 'cream', 'indigo', 'violet', 'charcoal', 'olive', 'lime', 'magenta', 'turquoise', 'lavender', 'tan', 'khaki', 'ivory', 'white', 'monochrome', 'multi-color', 'two-tone', 'ombre', 'matte-black', 'gloss-white', 'fuchsia', 'burgundy', 'emerald', 'sapphire', 'tangerine', 'coral', 'mint', 'peach', 'mauve', 'taupe', 'ochre', 'periwinkle', 'crimson', 'scarlet', 'azure', 'cobalt', 'cerulean', 'kelly-green', 'forest-green', 'hunter-green', 'jet-black', 'ebony', 'chocolate-brown', 'mocha', 'platinum', 'rose-gold', 'lemon-yellow', 'mustard', 'tangerine', 'burnt-orange', 'plum', 'lilac', 'faded-pink', 'hot-pink'],
  pattern: ['striped', 'floral', 'patterned', 'solid', 'plaid', 'checkered', 'gingham', 'paisley', 'logo', 'abstract', 'plain', 'houndstooth', 'polka-dot', 'embossed', 'embroidered', 'quilted', 'studded', 'camouflage', 'geometric', 'animal-print', 'tie-dye', 'herringbone', 'chevron', 'argyle', 'jacquard', 'damask', 'brocade', 'toile', 'dobby', 'tartan', 'leopard-print', 'zebra-print', 'camouflage', 'ikat', 'omnisphere', 'swirls', 'dots', 'lines', 'splatter', 'graffiti', 'marbled', 'moiré', 'seersucker', 'pin-stripe', 'pinstripe', 'gingham'],
  style: ['casual', 'formal', 'sporty', 'minimalist', 'vintage', 'modern', 'elegant', 'rugged', 'durable', 'classic', 'bohemian', 'chic', 'futuristic', 'distressed', 'faded', 'sheer', 'translucent', 'streetwear', 'athleisure', 'preppy', 'gothic', 'industrial', 'rustic', 'mid-century', 'scandinavian', 'art-deco', 'contemporary', 'transitional', 'traditional', 'glam', 'punk', 'hippie', 'goth', 'emo', 'skater', 'biker', 'rocker', 'country', 'western', 'urban', 'classic-retro', 'avant-garde', 'haute-couture'],
  fit: ['fitted', 'loose', 'baggy', 'cropped', 'oversized', 'slim-fit', 'loose-fit', 'tapered', 'flared', 'straight-leg', 'skinny', 'high-waisted', 'low-rise', 'capri', 'bootcut', 'wide-leg', 'relaxed-fit', 'relaxed', 'tailored', 'bodycon', 'flare', 'bell-bottom', 'pencil-skirt', 'a-line', 'trapeze', 'shift', 'empire-waist', 'cinched-waist', 'high-low'],
  shape: ['round', 'square', 'rectangular', 'oval', 'heart-shaped', 'circular', 'angular', 'geometric', 'curved', 'straight', 'asymmetrical', 'triangular', 'hexagonal', 'octagonal', 'cylindrical', 'conical', 'pyramidal', 'domed', 'globe', 'sphere', 'cube', 'cone', 'diamond-shaped', 'tear-drop', 'star-shaped', 'crescent-shaped'],
  features: ['long-sleeved', 'short-sleeved', 'crewneck', 'v-neck', 'hooded', 'collared', 'zipper', 'button', 'pockets', 'lace-up', 'buckle', 'velcro', 'snap', 'drawstring', 'platform-sole', 'wedge-heel', 'block-heel', 'stiletto', 'high-top', 'low-top', 'mid-top', 'cuffed', 'ribbed', 'pleated', 'ruched', 'sequined', 'hood', 'pocket', 'button-up', 'zip-up', 'drawstring-waist', 'elastic-waist', 'wide-leg', 'straight-leg', 'sleeveless', 'strapless', 'off-the-shoulder', 'one-shoulder', 'cap-sleeve', 'kimono-sleeve', 'batwing-sleeve', 'cut-outs', 'embellishments', 'fringe', 'tassels', 'beaded', 'studded', 'embroidered', 'appliques', 'patchwork', 'grommets', 'zippers', 'vents'],
  finish: ['shiny', 'matte', 'glossy', 'distressed', 'faded', 'perforated', 'sheer', 'translucent', 'stainless-steel', 'carbon-fiber', 'laminated', 'matte-black', 'gloss-white', 'brushed-metal', 'chrome-finish', 'brushed-finish', 'matte-finish', 'glossy-finish', 'polished', 'lacquered', 'powder-coated', 'textured', 'smooth', 'reflective', 'iridescent', 'satin-finish', 'high-gloss', 'low-gloss', 'satin-finish', 'embossed', 'etched', 'engraved', 'carved', 'sanded', 'varnished', 'painted', 'enameled', 'anodized', 'electroplated', 'hand-painted', 'hand-carved'],
};

// @desc    Get vector from image using Gemini API
export const getVectorFromImage = async (image) => {
  try {
    let base64Image;
    let mimeType;

    if (image.startsWith('data:')) {
      const parts = image.split(';');
      mimeType = parts[0].split(':')[1];
      base64Image = parts[1].split(',')[1];
    } else {
      const imageResponse = await axios.get(image, {
        responseType: 'arraybuffer'
      });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      base64Image = imageBuffer.toString('base64');
      mimeType = imageResponse.headers['content-type'];
    }
    
    const prompt = 'Please describe this product image in great detail, including categoryof object, type of object, colors, shapes, textures, and objects, in a comma-separated format. Do not use sentences.';
    
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    const textLower = text.toLowerCase();
    
    // Create vector with priority weighting and synonym mapping
    const vector = [];
    
    // Iterate over keywordMapping entries and apply weights
    for (const [category, keywords] of Object.entries(keywordMapping)) {
      const count = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword.replace('-', '\\-')}\\b`, 'g');
        return acc + (textLower.match(regex) || []).length;
      }, 0);

      let weight;
      if (['shoes', 'camera', 'laptop', 'watch', 'handbag', 'jacket', 'shirt'].includes(category)) {
        weight = 3;
      } else if (['apparel', 'furniture', 'fitness', 'accessory', 'electronics', 'kitchenware'].includes(category)) {
        weight = 2;
      } else {
        weight = 1;
      }
      vector.push(count * weight);
    }
    
    return vector;
  } catch (err) {
    console.error('Error generating vector from image:', err);
    return [];
  }
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching single product:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Search for products based on an image
// @route   POST /api/products/search
// @access  Private
export const searchProducts = async (req, res) => {
  const { image } = req.body;
  
  try {
    const queryVector = await getVectorFromImage(image);
    const allProducts = await Product.find({});

    const productsWithScores = allProducts.map(product => {
      const score = cosineSimilarity(queryVector, product.featureVector);
      return { ...product.toObject(), similarityScore: score };
    });

    // Sort products by similarity score in descending order
    productsWithScores.sort((a, b) => b.similarityScore - a.similarityScore);

    res.json({
      message: 'Search successful. Here are the results.',
      similarProducts: productsWithScores,
    });

  } catch (err) {
    console.error('Error during search:', err.message);
    res.status(500).json({ error: 'Server error during search' });
  }
};
