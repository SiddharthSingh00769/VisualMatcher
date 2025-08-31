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
  // === Super High Priority (weight: 4) ===
  highPriority: [
    'sneakers', 'trench-coat', 'dslr', 'smartwatch', 'ultrabook',
    'hiking-boots', 'gaming-laptop', 'blazer', 'backpack',
    'overcoat', 'windbreaker', 'camera', 'laptop', 'watch',
    'handbag', 'jacket', 'shirt',
    'iphone', 'android-phone', 'tablet', 'earbuds', 'headphones',
    'gaming-console', 'playstation', 'xbox', 'nintendo-switch',
    'smart-tv', 'monitor', 'keyboard', 'mouse', 'printer',
    'drone', 'gopro', 'mirrorless-camera',

    'running-shoes', 'formal-shoes', 'heels', 'sandals',
    'denim-jacket', 'hoodie', 't-shirt', 'suit', 'jeans',
    'dress', 'saree', 'kurta', 'sweater', 'coat',

    'makeup-kit', 'perfume', 'sunglasses', 'wallet',
    'fitness-band', 'earphones', 'projector', 'router',

    'electric-bike', 'scooter', 'car-accessories', 'helmet',
    'watch-strap', 'phone-case', 'powerbank', 'charger'
    ],

  // === High Priority Product Types (weight: 3) ===
  shoes: [
    'shoes', 'footwear', 'loafers', 'sandals', 'heels', 'flats',
    'slippers', 'mules', 'pumps', 'wedges', 'flip-flops', 'boots',
    'espadrilles', 'derbies', 'oxfords', 'brogues', 'platforms',
    'running-shoes', 'dress-shoes', 'high-tops', 'low-tops',
    'chukka-boots', 'chelsea-boots', 'clogs', 'boat-shoes',
    'mary-janes', 'moccasins', 'athletic-shoes', 'skate-shoes',
    'work-boots', 'stilettos', 'ballet-flats', 'walking-shoes',
    'hiking-shoes', 'water-shoes',
    'sneakers', 'trainers', 'cross-trainers', 'trail-running-shoes',
    'basketball-shoes', 'soccer-cleats', 'football-cleats',
    'tennis-shoes', 'golf-shoes', 'cycling-shoes', 'skateboarding-shoes',
    'rugby-boots', 'cricket-shoes', 'volleyball-shoes',
    'badminton-shoes', 'wrestling-shoes',
    'ankle-boots', 'combat-boots', 'cowboy-boots', 'snow-boots',
    'rain-boots', 'military-boots', 'motorcycle-boots',
    'steel-toe-boots', 'desert-boots', 'work-safety-shoes',
    'peep-toe-heels', 'kitten-heels', 'block-heels', 'platform-heels',
    'slingbacks', 'gladiator-sandals', 'strappy-sandals',
    'jelly-sandals', 'espadrille-wedges',
    'vegan-shoes', 'eco-friendly-shoes', 'barefoot-shoes',
    'minimalist-shoes', 'slip-ons', 'driving-shoes',
    'house-shoes', 'indoor-slippers', 'school-shoes',
    'orthopedic-shoes', 'diabetic-shoes',
    'chappals', 'juttis', 'kolhapuri-sandals', 'mojaris',
    'khussas', 'espadrille-flats', 'ugg-boots', 'crocs',
    'platform-sneakers', 'dad-sneakers', 'retro-sneakers',
    'limited-edition-sneakers'
  ],

  camera: [
    'camcorder', 'webcam', 'lens', 'tripod', 'flash', 'gopro', 'drone',
    'action-camera', 'mirrorless', 'point-and-shoot', 'instant-camera',
    'digital-camera', 'film-camera', 'security-camera', 'dash-cam',
    '360-camera', 'telescope', 'microscope', 'binoculars', 'monocular',
    'cctv-camera', 'spy-camera', 'trail-camera', 'video-camera',
    'surveillance-camera',
    'dslr', 'slr', 'medium-format-camera', 'rangefinder-camera',
    'cinema-camera', 'professional-video-camera', 'broadcast-camera',
    'underwater-camera', 'helmet-camera', 'body-camera', 'thermal-camera',
    'night-vision-camera', 'infrared-camera', 'wildlife-camera',
    'camera-bag', 'camera-case', 'gimbal', 'stabilizer',
    'camera-rig', 'camera-drone', 'ring-light', 'light-stand',
    'camera-microphone', 'external-flash', 'softbox', 'reflector',
    'lens-hood', 'filter-kit', 'telephoto-lens', 'wide-angle-lens',
    'prime-lens', 'macro-lens', 'zoom-lens', 'fish-eye-lens',
    'photography-camera', 'videography-camera', 'document-camera',
    'inspection-camera', 'industrial-camera', 'medical-camera',
    'scientific-camera', 'forensic-camera', 'aerial-camera',
    'polaroid', 'instax', 'nikon-camera', 'canon-camera',
    'sony-camera', 'fujifilm-camera', 'leica-camera',
    'hasselblad-camera', 'pentax-camera'
  ],

  laptop: [
    'notebook', 'chromebook', 'macbook', 'pc', 'tablet', 'monitor',
    'desktop', 'all-in-one', 'gaming-laptop', 'netbook', '2-in-1',
    'convertible', 'workstation', 'server', 'touchscreen-laptop',
    'ultrabook', 'thin-and-light-laptop', 'business-laptop',
    'student-laptop', 'budget-laptop', 'premium-laptop',
    'creator-laptop', 'developer-laptop', 'professional-laptop',
    'portable-workstation','e-sports-laptop', 'streaming-laptop', 'vr-ready-laptop',
    'graphics-laptop', 'cad-laptop', 'rendering-laptop',
    'laptop-stand', 'docking-station', 'laptop-cooler',
    'external-gpu', 'laptop-charger', 'laptop-sleeve',
    'laptop-bag', 'keyboard-cover','thinkpad', 'ideapad', 'surface-laptop', 'surface-book',
    'xps-laptop', 'alienware', 'omen-laptop', 'predator-laptop',
    'vivobook', 'zenbook', 'gram-laptop', 'aspire-laptop',
    'swift-laptop', 'rog-laptop', 'tuf-gaming-laptop',
    'pavilion-laptop', 'elitebook', 'spectre-laptop',
    'envy-laptop', 'latitude-laptop', 'precision-laptop',
    'rugged-laptop', 'field-laptop', 'engineering-laptop',
    'industrial-laptop', 'medical-laptop', 'educational-laptop',
    'touchbar-laptop', 'detachable-laptop', 'mini-laptop',
    'cloudbook', 'arm-laptop'
  ],

  watch: [
    'wristwatch', 'chronograph', 'timepiece', 'fitness-tracker',
    'pocket-watch', 'digital-watch', 'analog-watch', 'sports-watch',
    'dive-watch', 'dress-watch', 'pilot-watch', 'field-watch',
    'automatic-watch', 'quartz-watch', 'solar-watch', 'mechanical-watch',
    'smart-band','luxury-watch', 'minimalist-watch', 'hybrid-watch',
    'skeleton-watch', 'tourbillon-watch', 'gmt-watch',
    'racing-watch', 'aviator-watch', 'military-watch',
    'survival-watch', 'compass-watch', 'tactical-watch',
    'medical-watch', 'kids-watch', 'nurse-watch',
    'smartwatch', 'android-watch', 'apple-watch',
    'garmin-watch', 'samsung-watch', 'huawei-watch',
    'xiaomi-watch', 'amazfit-watch', 'fossil-smartwatch',
    'hybrid-smartwatch', 'smart-ring',
    'rolex', 'omega-watch', 'tag-heuer', 'seiko-watch',
    'casio-watch', 'g-shock', 'citizen-watch', 'tissot-watch',
    'breitling-watch', 'hublot-watch', 'patek-philippe',
    'audemars-piguet', 'longines-watch', 'rado-watch',
    'swatch', 'orient-watch', 'movado-watch',
    'solar-powered-watch', 'kinetic-watch',
    'radio-controlled-watch', 'gps-watch',
    'heart-rate-watch', 'sleep-tracker-watch',
    'altimeter-watch', 'barometer-watch',
    'complication-watch'
  ],

  handbag: [
    'bag', 'purse', 'clutch', 'tote', 'satchel', 'messenger-bag', 'hobo',
    'duffel', 'fanny-pack', 'briefcase', 'wallet', 'crossbody-bag',
    'shoulder-bag', 'shopper', 'luggage', 'suitcase', 'cosmetic-bag',
    'diaper-bag', 'weekender', 'trolley', 'evening-bag', 'bucket-bag',
    'sling-bag', 'belt-bag', 'waist-bag', 'hip-pack',
    'wristlet', 'minaudiere', 'baguette-bag', 'bowler-bag',
    'doctor-bag', 'camera-bag', 'barrel-bag', 'drawstring-bag',
    'flap-bag', 'box-bag', 'micro-bag', 'mini-bag',
    'oversized-bag', 'structured-bag', 'unstructured-bag',
    'chain-bag', 'fringe-bag','birkin-bag', 'kelly-bag', 'lady-dior', 'gucci-marmont',
    'prada-saffiano', 'ysl-clutch', 'lv-speedy', 'lv-neverfull',
    'chanel-flap-bag', 'hermes-tote',
    'carry-on', 'travel-bag', 'garment-bag',
    'gym-bag', 'sports-bag', 'laptop-bag',
    'tech-organizer', 'passport-holder',
    'beach-bag', 'market-bag', 'shopping-bag',
    'eco-bag', 'reusable-bag', 'jute-bag',
    'straw-bag', 'raffia-bag', 'woven-bag',
    'leather-bag', 'vegan-leather-bag',
    'canvas-bag', 'nylon-bag', 'denim-bag'
  ],

  jacket: [
    'coat', 'parka', 'cardigan', 'anorak', 'vest', 'pullover',
    'windbreaker', 'trench-coat', 'overcoat', 'hoodie', 'bomber-jacket',
    'denim-jacket', 'leather-jacket', 'raincoat', 'puffer-jacket',
    'peacoat', 'tuxedo-jacket', 'suit-jacket', 'varsity-jacket',
    'poncho', 'cape', 'kimono', 'robe', 'track-jacket', 'fleece-jacket',
    'blazer', 'double-breasted-jacket', 'single-breasted-jacket',
    'biker-jacket', 'motorcycle-jacket', 'field-jacket',
    'coach-jacket', 'shacket', 'quilted-jacket', 'cropped-jacket',
    'longline-jacket', 'oversized-jacket', 'peplum-jacket',
    'ski-jacket', 'snowboard-jacket', 'hiking-jacket',
    'softshell-jacket', 'gore-tex-jacket', 'fishing-jacket',
    'sailing-jacket', 'windcheater', 'thermal-jacket',
    'insulated-jacket', 'waterproof-jacket', 'shell-jacket',
    'spring-jacket', 'fall-jacket', 'summer-jacket', 'winter-jacket',
    'down-jacket', 'anorak-parka', 'military-jacket',
    'trapper-jacket', 'duffle-coat', 'mackintosh', 'cagoule'
  ],

  shirt: [
    't-shirt', 'polo-shirt', 'blouse', 'tunic', 'tank-top', 'sweatshirt',
    'jersey', 'henley', 'dress-shirt', 'button-down', 'flannel',
    'crewneck-shirt', 'v-neck-shirt', 'long-sleeve-shirt',
    'short-sleeve-shirt', 'halter-top', 'tube-top', 'crop-top', 'bodysuit',
    'camisole', 'graphic-tee', 'rugby-shirt', 'mock-turtleneck',
    'oversized-t-shirt', 'striped-shirt', 'checked-shirt', 'denim-shirt',
    'linen-shirt', 'cotton-shirt', 'chambray-shirt', 'band-shirt',
    'hooded-shirt', 'peasant-top', 'off-shoulder-shirt', 'ruffle-top',
    'tie-front-shirt', 'wrap-top', 'bell-sleeve-top', 'asymmetrical-top',
    'oxford-shirt', 'poplin-shirt', 'dress-blouse', 'chiffon-blouse',
    'silk-shirt', 'satin-shirt', 'pinstripe-shirt', 'mandarin-collar-shirt',
    'grandad-collar-shirt', 'military-shirt', 'camp-collar-shirt',
    'button-up-shirt', 'short-sleeve-button-up', 'long-sleeve-button-up',
    'kurta', 'kaftan', 'chemisier', 'smock-top', 'kurti', 'dashiki',
    'boubou', 'hanfu-top', 'kimono-top', 'sari-blouse',
    'thermal-top', 'base-layer-shirt', 'rash-guard', 'cycling-jersey',
    'sports-top', 'yoga-top', 'swim-shirt', 'sun-protection-top'
  ],
  smartwatch: ['smartwatch', 'wearable', 'fitness-watch', 'oled-watch', 'gps-watch'],
  gamingConsole: ['playstation', 'xbox', 'nintendo-switch', 'handheld-console', 'gaming-console'],
  cameraLens: ['wide-angle-lens', 'telephoto-lens', 'prime-lens', 'macro-lens', 'zoom-lens'],
  headphones: ['over-ear', 'on-ear', 'in-ear', 'noise-cancelling', 'wireless-headphones', 'gaming-headset'],
  backpack: ['daypack', 'hiking-backpack', 'travel-backpack', 'school-bag', 'laptop-backpack'],

  // === Broad Product Types (weight: 2) ===
  apparel: [
    'jeans', 'denim', 'trousers', 'leggings', 'cargos', 'chinos',
    'khakis', 'slacks', 'pants', 'shorts', 'skirt', 'dress', 'romper',
    'jumpsuit', 'overalls', 'suit', 'sweater', 'hoodie', 'miniskirt',
    'maxi-dress', 'sweatpants', 'joggers', 'pajamas', 'swimsuit', 'bra',
    'underwear', 'socks', 'stockings', 'tie', 'belt', 'scarf', 'gloves',
    'hat', 'cap', 'tights','crop-top', 'tank-top', 'graphic-tee', 'v-neck-top', 'longline-tee',
    'button-up-shirt', 'polo-shirt', 'denim-jacket', 'bomber-jacket',
    'cardigan', 'sweatshirt', 'hooded-sweater', 'poncho', 'kimono', 
    'vest', 'pullover', 'anorak', 'track-pants', 'leggings-capri', 'culottes',
    'blazer', 'waistcoat', 'pencil-skirt', 'shift-dress', 'sheath-dress',
    'trousersuit', 'pant-suit', 'peacoat', 'tuxedo', 'dress-coat',
    'kurta', 'kurti', 'sari', 'lehenga', 'salwar', 'choli', 'dashiki',
    'kaftan', 'hanfu', 'kimono-dress', 'cheongsam', 'boubou', 'tunic-top',
    'thermal-top', 'thermal-pants', 'base-layer', 'raincoat', 'windbreaker',
    'swim-shorts', 'rash-guard', 'cycling-shorts', 'ski-jacket', 'ski-pants',
    'snow-pants', 'snow-hoodie', 'beach-coverup', 'sarong', 'sun-hat'
  ],

  furniture: [
    'table', 'chair', 'sofa', 'bookshelf', 'bed', 'dresser', 'desk',
    'cabinet', 'wardrobe', 'bench', 'ottoman', 'stool', 'lamp', 'rug',
    'mirror', 'mattress', 'recliner', 'chaise-lounge', 'bar-stool',
    'armchair', 'patio-furniture', 'vanity', 'hammock', 'bean-bag',
    'coffee-table', 'console-table', 'side-table', 'sofa-bed', 'sectional-sofa',
    'futon', 'sleeper-sofa', 'chaise-sofa', 'loveseat', 'accent-chair', 'rocking-chair',
    'nightstand', 'dresser-mirror', 'wardrobe-cabinet', 'armoire', 'trundle-bed',
    'bunk-bed', 'headboard', 'footboard', 'vanity-stool',
    'dining-table', 'dining-chair', 'bar-cabinet', 'buffet', 'china-cabinet',
    'bench-seating', 'stool-set','office-desk', 'office-chair', 'file-cabinet', 'bookcase', 'cubicle',
    'conference-table', 'executive-chair',
    'garden-chair', 'patio-table', 'deck-chair', 'outdoor-bench', 'picnic-table',
    'sun-lounger', 'gazebo-furniture', 'porch-swing', 'adirondack-chair',
    'display-shelf', 'etagere', 'sideboard', 'console-shelf', 'coat-rack',
    'shoe-rack', 'trunk', 'storage-bench', 'cubby', 'wall-unit'
  ],

  fitness: [
    'mat', 'dumbbells', 'bands', 'bike', 'treadmill', 'rope', 'barbell',
    'kettlebell', 'weights', 'gloves', 'ball', 'elliptical', 'punching-bag',
    'yoga-block', 'jump-rope', 'resistance-bands', 'rowing-machine',
    'gym-bag', 'sports-bottle', 'exercise-ball', 'medicine-ball',
    'pull-up-bar', 'squat-rack', 'weight-bench', 'spin-bike',
    'smith-machine', 'leg-press', 'bench-press', 'lat-pulldown', 'cable-machine',
    'dumbbell-rack', 'power-rack', 'pull-up-assist-band', 'weighted-vest',
    'stationary-bike', 'rowing-machine', 'stair-climber', 'elliptical-trainer',
    'treadmill-belt', 'assault-bike', 'mini-stepper', 'jump-trainer',
    'bosu-ball', 'balance-board', 'sliding-discs', 'ab-wheel', 'trx-suspension',
    'medicine-ball-set', 'stability-ball', 'core-trainer', 'foam-roller',
    'massage-gun', 'stretching-straps', 'yoga-bolster', 'resistance-loop',
    'exercise-towel', 'fitness-tracker', 'heart-rate-monitor', 'hydration-pack',
    'pull-up-assist-band', 'ankle-weights', 'wrist-weights', 'power-gloves'
  ],

  accessory: [
    'belt', 'necklace', 'wallet', 'backpack', 'scarf', 'sunglasses',
    'ring', 'earrings', 'bracelet', 'hat', 'cap', 'gloves', 'tie',
    'keychain', 'anklet', 'hair-pin', 'brooch', 'locket', 'bangle',
    'pendant', 'choker', 'studs', 'hoops', 'fedora', 'beanie', 'visor',
    'headband', 'earmuffs', 'wristband', 'lanyard', 'charm',
    'cufflinks', 'watch-band', 'hairband', 'hair-tie', 'hair-claw',
    'bandana', 'pocket-square', 'suspenders', 'neck-tie', 'bow-tie',
    'hat-band', 'glasses', 'reading-glasses', 'sunglass-case',
    'bracelet-watch', 'fitness-band', 'travel-wallet', 'passport-holder',
    'coin-purse', 'key-holder', 'card-holder', 'phone-case', 'tech-accessory',
    'brooch-pin', 'capelet', 'mittens', 'arm-sleeves', 'fingerless-gloves',
    'ankle-bracelet', 'toe-ring', 'nose-ring', 'body-chain', 'hand-chain',
    'ear-cuff', 'clip-on-earrings', 'hair-clip', 'hair-barrette', 'hair-comb'
  ],

  electronics: [
    'headphones', 'earbuds', 'speaker', 'laptop', 'tablet', 'camera',
    'keyboard', 'mouse', 'watch', 'monitor', 'phone', 'printer',
    'microphone', 'drone', 'router', 'modem', 'console', 'e-reader',
    'power-bank', 'charger', 'projector', 'hard-drive', 'usb-drive',
    'gaming-console', 'tv', 'radio', 'air-fryer', 'coffee-maker',
    'blender', 'microwave', 'smart-bulb',
    'smartphone', 'fitness-tracker', 'smartwatch', 'desktop-pc', 'all-in-one-pc',
    'external-hdd', 'ssd', 'network-switch', 'hdmi-cable', 'usb-cable',
    'wireless-charger', 'tablet-stand', 'laptop-stand', 'vr-headset',
    'gaming-keyboard', 'gaming-mouse', 'mechanical-keyboard', 'webcam-cover',
    'ring-light', 'studio-light', 'soundbar', 'home-theater-system',
    'bluetooth-speaker', 'smart-plug', 'smart-display', 'digital-photo-frame',
    'dash-cam', 'security-camera', 'surveillance-kit', '3d-printer',
    'scanner', 'plotter', 'drawing-tablet', 'graphic-tablet', 'electric-kettle',
    'toaster', 'rice-cooker', 'juicer', 'food-processor', 'dishwasher',
    'vacuum-cleaner', 'robot-vacuum', 'air-purifier', 'humidifier',
    'thermostat', 'smart-doorbell', 'smart-lock', 'gps-device', 'car-charger'
  ],

  kitchenware: [
    'mug', 'bottle', 'cup', 'plate', 'bowl', 'utensils', 'glass', 'fork',
    'spoon', 'knife', 'dishes', 'glasses', 'tumbler', 'pitcher',
    'carafe', 'tea-pot', 'coffee-maker', 'blender', 'toaster',
    'microwave', 'kettle', 'pan', 'pot', 'cutting-board', 'spatula',
    'whisk', 'tongs', 'ladle', 'strainer', 'colander', 'can-opener',
    'grater', 'peeler', 'rolling-pin', 'baking-sheet', 'frying-pan',
    'wok', 'food-processor', 'juicer','measuring-cup', 'measuring-spoon', 'mixing-bowl', 'salad-spinner',
    'garlic-press', 'corkscrew', 'pizza-cutter', 'egg-beater', 'egg-whisk',
    'sieve', 'mortar-and-pestle', 'oil-dispenser', 'butter-dish', 'soup-ladle',
    'grill-pan', 'pressure-cooker', 'slow-cooker', 'rice-steamer', 'bread-maker',
    'waffle-maker', 'sandwich-press', 'deep-fryer', 'ice-cream-maker',
    'cookie-cutter', 'rolling-mat', 'baking-pan', 'cake-tin', 'loaf-pan',
    'pie-dish', 'muffin-tin', 'cupcake-liner', 'pastry-brush', 'thermometer',
    'food-storage-container', 'spice-rack', 'salt-shaker', 'pepper-mill',
    'cutting-mat', 'pot-holder', 'oven-mitts', 'dish-rack', 'tray', 'teapot-set',
    'coffee-grinder', 'espresso-machine', 'milk-frother', 'hot-plate'
  ],

  // === New Keys (weight: 2) ===
  beauty: [
    'lipstick', 'mascara', 'eyeliner', 'foundation', 'concealer', 'primer',
    'highlighter', 'blush', 'bronzer', 'eyeshadow', 'nail-polish',
    'lip-balm', 'lip-gloss', 'perfume', 'cologne', 'fragrance',
    'makeup-remover', 'serum', 'moisturizer', 'cleanser', 'shampoo',
    'conditioner', 'hair-dryer', 'straightener', 'curler', 'hair-brush',
    'razor', 'trimmer','setting-spray', 'compact-powder', 'loose-powder', 'concealer-stick',
    'brow-pencil', 'brow-gel', 'eyelash-extensions', 'eyelash-serum',
    'lip-liner', 'lip-stain', 'tinted-moisturizer', 'BB-cream', 'CC-cream',
    'face-mask', 'peel-off-mask', 'sheet-mask',
    'toner', 'essence', 'facial-oil', 'eye-cream', 'face-mist', 'exfoliator',
    'scrub', 'sunscreen', 'night-cream', 'body-lotion', 'body-oil',
    'hand-cream', 'foot-cream', 'cuticle-oil', 'blemish-treatment',
    'hair-serum', 'leave-in-conditioner', 'hair-mousse', 'hair-wax', 
    'hair-gel', 'hair-spray', 'hair-clip', 'hair-tie', 'bobby-pins', 
    'hair-band', 'scalp-treatment', 'heat-protectant', 'curling-iron', 
    'flat-iron', 'diffuser', 'hair-steamer','body-wash', 'soap', 'deodorant', 'antiperspirant', 'shaving-cream',
    'aftershave', 'nail-file', 'cuticle-clipper', 'tweezers', 'eyebrow-razor',
    'foot-file', 'manicure-set', 'pedicure-set', 'bath-bomb', 'loofah'
  ],

  toys: [
    'lego', 'puzzle', 'board-game', 'action-figure', 'doll', 'plush',
    'stuffed-animal', 'remote-car', 'drone-toy', 'train-set',
    'building-blocks', 'playset', 'rc-helicopter', 'slime',
    'fidget-spinner', 'yo-yo', 'marbles', 'chess', 'cards',
    'beyblade', 'barbie', 'hot-wheels', 'nerf-gun',
    'rc-car', 'rc-boat', 'rc-drone', 'remote-controlled-plane',
    'puzzle-cube', 'magnetic-tiles', 'building-sets', 'wooden-toys',
    'stacking-toys', 'shape-sorter', 'toy-instruments', 'toy-piano',
    'toy-guitar', 'toy-drums', 'pretend-play-kitchen', 'play-food',
    'dollhouse', 'mini-figures', 'action-figure-sets', 'soft-toys',
    'plush-animals', 'stuffed-dinosaur', 'stuffed-bear', 'stuffed-unicorn',
    'educational-toys', 'robot-toy', 'programmable-robot', 'coding-toys',
    'science-kit', 'art-and-craft-kit', 'slime-kit', 'model-kit',
    'puppet', 'finger-puppet', 'hand-puppet', 'marionette', 'toy-car-track',
    'hot-wheels-track', 'lego-diorama', 'lego-minifigures', 'mini-puzzle',
    'giant-puzzle', 'tactile-toys', 'sensory-toys', 'water-toys',
    'pool-toys', 'bath-toys', 'scooter', 'skateboard', 'roller-skates',
    'tricycle', 'balance-bike', 'play-tent', 'tunnel', 'playhouse', 
    'ride-on-toy', 'push-toy', 'pull-toy'
  ],

  books: [
    'novel', 'comics', 'manga', 'textbook', 'encyclopedia',
    'dictionary', 'storybook', 'journal', 'notebook', 'magazine',
    'workbook', 'biography', 'cookbook', 'guidebook', 'handbook',
    'atlas', 'manual', 'poetry', 'script',
    'graphic-novel', 'science-fiction', 'fantasy', 'thriller', 'mystery',
    'romance', 'horror', 'adventure', 'children-book', 'young-adult',
    'self-help', 'motivational', 'philosophy', 'history-book', 'travel-guide',
    'art-book', 'photography-book', 'design-book', 'architecture-book',
    'textbook-math', 'textbook-physics', 'textbook-chemistry', 'textbook-biology',
    'dictionary-english', 'dictionary-foreign', 'language-book', 'grammar-book',
    'exercise-book', 'revision-guide', 'case-study', 'anthology', 'short-stories',
    'novella', 'fairy-tale', 'mythology', 'comic-strip', 'satire', 'humor-book',
    'reference-book', 'encyclopedia-child', 'atlas-world', 'atlas-countries',
    'academic-journal', 'magazine-science', 'magazine-fashion', 'magazine-tech',
    'manual-car', 'manual-appliances', 'handbook-teacher', 'handbook-student',
    'religious-text', 'scripture', 'bestseller', 'classic-literature', 'memoir',
    'autobiography', 'casebook', 'policy-book', 'law-book', 'exam-prep-book',
    'practice-book', 'lab-manual', 'guide-to-coding', 'guide-to-photography'
  ],

  grocery: [
    'rice', 'wheat', 'flour', 'sugar', 'salt', 'oil', 'butter', 'milk',
    'cheese', 'egg', 'chocolate', 'snacks', 'chips', 'cookies',
    'biscuits', 'cereal', 'pasta', 'noodles', 'spices', 'tea', 'coffee',
    'juice', 'soda', 'water-bottle', 'soup', 'sauce', 'jam', 'honey',
    'lentils', 'beans', 'chickpeas', 'peas', 'corn', 'quinoa', 'oats',
    'barley', 'millet', 'rye', 'breadcrumbs', 'coconut', 'almonds', 'cashews',
    'walnuts', 'peanuts', 'pistachios', 'raisins', 'dried-fruits', 'dates',
    'figs', 'prunes', 'maple-syrup', 'honeycomb', 'vinegar', 'soy-sauce',
    'ketchup', 'mustard', 'mayonnaise', 'pickles', 'salsa', 'curry-paste',
    'herbs', 'oregano', 'basil', 'thyme', 'rosemary', 'chili-powder', 'cumin',
    'coriander', 'turmeric', 'paprika', 'ginger', 'garlic', 'onion-powder',
    'vanilla-extract', 'baking-powder', 'baking-soda', 'cornstarch',
    'chocolate-chips', 'peanut-butter', 'jam-strawberry', 'jam-apricot',
    'yogurt', 'cream', 'cream-cheese', 'condensed-milk', 'evaporated-milk',
    'ice-cream', 'frozen-vegetables', 'frozen-fruits', 'ready-meals',
    'instant-noodles', 'energy-bars', 'protein-powder', 'baby-food',
    'gluten-free-products', 'organic-products', 'health-supplements', 'tea-leaves',
    'coffee-beans', 'sparkling-water', 'soft-drinks', 'smoothie', 'fruit-juice'
  ],

  // === Attributes (weight: 1) ===
  material: [
    'denim', 'leather', 'wool', 'cotton', 'polyester', 'satin', 'knit',
    'wood', 'metal', 'plastic', 'glass', 'velvet', 'corduroy', 'silk',
    'linen', 'suede', 'mesh', 'twill', 'canvas', 'spandex', 'rayon',
    'nylon', 'acrylic', 'stone', 'bamboo', 'felt', 'lace', 'chiffon',
    'cashmere', 'velour', 'organza', 'tweed', 'flannel', 'shearling',
    'denier', 'faux-leather', 'neoprene', 'polyurethane', 'latex', 'microfiber',
    'merino-wool', 'alpaca', 'tencel', 'modal', 'bamboo-fiber', 'recycled-polyester',
    'viscose', 'lyocell', 'carbon-fiber', 'kevlar', 'fiberglass', 'ceramic',
    'resin', 'acetal', 'polycarbonate', 'epoxy', 'brass', 'copper', 'bronze',
    'stainless-steel', 'aluminum', 'titanium', 'marble', 'granite', 'slate',
    'opal', 'jade', 'quartz', 'mica', 'polypropylene', 'hemp', 'jute', 'raffia',
    'seersucker', 'pongee', 'batiste', 'pongee-silk', 'crêpe', 'poplin', 'gabardine',
    'herringbone', 'lamé', 'brocade', 'taffeta', 'duvetine', 'pongee-cotton'
  ],

  color: [
    'red', 'blue', 'green', 'black', 'brown', 'gray', 'silver', 'gold',
    'yellow', 'orange', 'purple', 'pink', 'cyan', 'teal', 'navy',
    'maroon', 'beige', 'cream', 'indigo', 'violet', 'olive', 'lime',
    'magenta', 'turquoise', 'lavender', 'tan', 'ivory', 'white',
    'multi-color', 'two-tone', 'fuchsia', 'burgundy', 'emerald',
    'sapphire', 'coral', 'mint', 'peach', 'mauve',
    'apricot', 'auburn', 'cerulean', 'chartreuse', 'cobalt', 'denim-blue',
    'emerald-green', 'forest-green', 'frost-blue', 'ginger', 'gunmetal',
    'hazel', 'khaki', 'lemon', 'lilac', 'marigold', 'mustard', 'ochre',
    'pearl', 'periwinkle', 'plum', 'rose', 'ruby', 'rust', 'sand', 'seafoam',
    'sky-blue', 'slate', 'smoke', 'taupe', 'ultramarine', 'vermilion',
    'wine', 'charcoal', 'onyx', 'carmine', 'sage', 'ivory-white', 'jet-black',
    'opal', 'mint-green', 'blush', 'pistachio', 'copper', 'bronze'
  ],

  pattern: [
    'striped', 'floral', 'solid', 'plaid', 'checkered', 'paisley',
    'logo', 'houndstooth', 'polka-dot', 'embroidered', 'camouflage',
    'geometric', 'tie-dye', 'chevron', 'argyle', 'tartan',
    'leopard-print', 'zebra-print', 'ikat', 'graffiti', 'marbled',
    'batik', 'brocade', 'damask', 'jacquard', 'houndstooth-check',
    'pinstripe', 'houndstooth-pattern', 'gingham', 'abstract-print',
    'animal-print', 'tropical-print', 'paisley-print', 'digital-print',
    'ombre', 'color-block', 'splatter', 'star-print', 'heart-print',
    'polka-stripe', 'grid', 'mesh-pattern', 'quilted', 'check-print',
    'houndstooth-check', 'ethnic-print', 'folk-print', 'leaf-print',
    'camouflage-pattern', 'wave-pattern', 'zigzag', 'swirl', 'gradient'
  ],

  style: [
    'casual', 'formal', 'sporty', 'minimalist', 'vintage', 'modern',
    'elegant', 'rugged', 'classic', 'bohemian', 'chic', 'streetwear',
    'athleisure', 'preppy', 'gothic', 'punk', 'skater', 'biker',
    'rocker', 'western', 'urban', 'haute-couture',
    'grunge', 'retro', 'mod', 'hip-hop', 'k-pop', 'anime-inspired',
    'festival', 'cyberpunk', 'techwear', 'avant-garde', 'industrial',
    'military', 'eco-friendly', 'casual-chic', 'romantic', 'ethereal',
    'punk-rock', 'lo-fi', 'normcore', 'soft-grunge', 'vaporwave',
    'y2k', 'street-chic', 'business-casual', 'smart-casual', 'loungewear',
    'boho-chic', 'cottagecore', 'dark-academia', 'light-academia', 'artsy'
  ],

  fit: [
    'fitted', 'loose', 'baggy', 'cropped', 'oversized', 'slim-fit',
    'tapered', 'flared', 'skinny', 'high-waisted', 'low-rise',
    'bootcut', 'wide-leg', 'relaxed-fit', 'tailored', 'bodycon',
    'athletic-fit', 'regular-fit', 'boxy', 'slouchy', 'straight-leg',
    'mid-rise', 'ankle-length', 'petite-fit', 'plus-size', 'longline',
    'shortened', 'mid-length', 'funnel-fit', 'trapeze', 'empire-waist',
    'drop-shoulder', 'elastic-waist', 'adjustable-fit', 'overslung',
    'slim-straight', 'carrot-fit', 'culottes', 'mermaid-fit'
  ],

  shape: [
    'round', 'square', 'rectangular', 'oval', 'heart-shaped',
    'circular', 'triangular', 'hexagonal', 'octagonal', 'cylindrical',
    'cone', 'diamond-shaped', 'tear-drop', 'star-shaped',
    'crescent', 'semicircular', 'elliptical', 'trapezoid', 'pentagon',
    'rhombus', 'parallelogram', 'kite-shaped', 'arrow-shaped', 'shield-shaped',
    'cross-shaped', 'spiral', 'teardrop', 'petal-shaped', 'leaf-shaped',
    'fan-shaped', 'hexagram', 'octagram', 'bullet-shaped', 'pear-shaped',
    'drop-shaped', 'bean-shaped', 'c-shaped', 'u-shaped', 'v-shaped'
  ],

  features: [
    'long-sleeved', 'short-sleeved', 'crewneck', 'v-neck', 'hooded',
    'collared', 'zipper', 'button', 'pockets', 'lace-up', 'buckle',
    'drawstring', 'platform-sole', 'wedge-heel', 'block-heel',
    'stiletto', 'high-top', 'low-top', 'pleated', 'ruched',
    'sleeveless', 'strapless', 'off-the-shoulder', 'cut-outs',
    'fringe', 'tassels', 'beaded', 'embroidered', 'patchwork',
    'wrap-style', 'peplum', 'ruffled', 'shirred', 'cowl-neck',
    'halter-neck', 'asymmetric-hem', 'slit', 'side-zip', 'elastic-waist',
    'drawstring-hood', 'button-down-front', 'belted', 'toggle-closure',
    'snap-button', 'ribbed-cuffs', 'ribbed-hem', 'mesh-panel', 'vented',
    'padded', 'quilted', 'waterproof', 'insulated', 'reflective',
    'removable-lining', 'detachable-hood', 'adjustable-strap', 'convertible'
  ],

  finish: [
    'shiny', 'matte', 'glossy', 'distressed', 'faded', 'perforated',
    'sheer', 'translucent', 'carbon-fiber', 'chrome-finish',
    'brushed-finish', 'polished', 'lacquered', 'powder-coated',
    'smooth', 'reflective', 'iridescent', 'satin-finish',
    'high-gloss', 'embossed', 'engraved', 'carved', 'painted',
    'enameled', 'anodized','textured', 'pebbled', 'marble-finish', 'granite-finish', 'oxidized',
    'rustic', 'antique', 'weathered', 'patina', 'glazed', 'frosted',
    'matte-metal', 'brushed-metal', 'soft-touch', 'velvety', 'metallic',
    'glitter', 'sparkling', 'iridescent-gloss', 'polished-stone', 
    'holographic', 'oil-rubbed', 'burnished', 'distressed-wood'
  ]
};

export const getVectorFromImage = async (image) => {
  try {
    let base64Image;
    let mimeType;

    if (image.startsWith("data:")) {
      const parts = image.split(";");
      mimeType = parts[0].split(":")[1];
      base64Image = parts[1].split(",")[1];
    } else {
      // Case: image URL
      const imageResponse = await axios.get(image, {
        responseType: "arraybuffer",
      });
      const imageBuffer = Buffer.from(imageResponse.data, "binary");
      base64Image = imageBuffer.toString("base64");
      mimeType = imageResponse.headers["content-type"];
      if (!mimeType || mimeType === "application/octet-stream") {
        const ext = path.extname(image).toLowerCase();
        if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
        else if (ext === ".png") mimeType = "image/png";
        else if (ext === ".webp") mimeType = "image/webp";
        else mimeType = "image/jpeg"; 
      }
    }

    const prompt = `
      Carefully analyze this product image and extract every relevant detail. Focus on the following aspects:
      1. Product type and category (e.g., shoes, laptop, handbag)
      2. Colors (all dominant and accent colors, shades, gradients)
      3. Material and texture (e.g., leather, denim, metallic, smooth, rough)
      4. Shape and geometry (e.g., round, square, cylindrical)
      5. Patterns or prints (e.g., striped, floral, plaid, polka-dot)
      6. Style and fashion attributes (e.g., casual, formal, sporty)
      7. Functional features (e.g., zipper, pockets, straps, buttons)
      8. Any accessories or additional visible objects

      Output the results as a **flat comma-separated list of keywords only**. 
      - Avoid sentences, paragraphs, or descriptions.  
      - Use precise, product-relevant terms suitable for categorization and vectorization.  
      - Prioritize mentioning colors and high-value product features first.  
      - Include synonyms or alternate terms if applicable.
      `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    const textLower = text.toLowerCase();

    const vector = [];

    const getKeywordCount = (text, keywords) => {
      return keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword.replace("-", "\\-")}\\b`, "g");
        return acc + (text.match(regex) || []).length;
      }, 0);
    };

    // Define priority categories and their weights
    const priorityLevels = {
      4: ["highPriority"],
      3: [
        "shoes",
        "camera",
        "laptop",
        "watch",
        "handbag",
        "jacket",
        "shirt",
        "smartwatch",
        "gamingConsole",
        "cameraLens",
        "headphones",
        "backpack",
      ],
      2: [
        "apparel",
        "furniture",
        "fitness",
        "accessory",
        "electronics",
        "kitchenware",
        "beauty",
        "toys",
        "books",
        "grocery",
      ],
      1: ["material", "pattern", "style", "fit", "shape", "features", "finish"], // low priority
      1.5: ["color"], // sub-priority
    };

    // Iterate over keywordMapping entries and apply weights
    const allKeywords = Object.keys(keywordMapping);

    allKeywords.forEach((category) => {
      const keywords = keywordMapping[category];
      const count = getKeywordCount(textLower, keywords);

      let weight = 1; // default
      if (priorityLevels[4].includes(category)) weight = 4;
      else if (priorityLevels[3].includes(category)) weight = 3;
      else if (priorityLevels[2].includes(category)) weight = 2;
      else if (priorityLevels[1.5].includes(category)) weight = 1.5;

      vector.push(count * weight);
    });

    return vector;
  } catch (err) {
    console.error("Error generating vector from image:", err);
    return [];
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

export const addProduct = async (req, res) => {
  const { name, category, description, imageUrl } = req.body;

  try {
    const featureVector = await getVectorFromImage(imageUrl);

    // Create a new product instance
    const newProduct = new Product({
      name,
      category,
      description,
      imageUrl,
      featureVector
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json({ message: 'Product added successfully!', product: savedProduct });
  } catch (err) {
    console.error('Error adding new product:', err.message);
    res.status(500).json({ message: 'Server error during product creation.' });
  }
};

export const searchProducts = async (req, res) => {
  const { image } = req.body;
  
  try {
    const queryVector = await getVectorFromImage(image);
    const allProducts = await Product.find({});

    const productsWithScores = allProducts.map(product => {
      const score = cosineSimilarity(queryVector, product.featureVector);
      return { ...product.toObject(), similarityScore: score };
    });

    // Sort products by similarity score in descending order and return only the top 12
    productsWithScores.sort((a, b) => b.similarityScore - a.similarityScore);
    const top12Products = productsWithScores.slice(0, 12);

    res.json({
      message: 'Search successful. Here are the results.',
      similarProducts: top12Products,
    });

  } catch (err) {
    console.error('Error during search:', err.message);
    res.status(500).json({ error: 'Server error during search' });
  }
};
