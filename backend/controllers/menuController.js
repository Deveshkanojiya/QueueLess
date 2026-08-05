const MenuItem = require('../models/MenuItem');

const SEED_ITEMS = [
  { name: 'Masala Dosa', description: 'Crispy dosa with spiced potato filling', category: 'Breakfast', price: 40, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', available: true },
  { name: 'Idli Sambar', description: 'Soft idlis served with hot sambar and chutney', category: 'Breakfast', price: 30, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', available: true },
  { name: 'Poha', description: 'Flattened rice with onions, peanuts and spices', category: 'Breakfast', price: 25, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400', available: true },
  { name: 'Veg Thali', description: 'Full meal with rice, dal, sabzi, roti and salad', category: 'Lunch', price: 80, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', available: true },
  { name: 'Chicken Biryani', description: 'Aromatic basmati rice with spiced chicken', category: 'Lunch', price: 120, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', available: true },
  { name: 'Paneer Butter Masala + Roti', description: 'Rich paneer curry with 3 rotis', category: 'Lunch', price: 90, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', available: true },
  { name: 'Samosa (2 pcs)', description: 'Crispy fried pastry with spiced potato filling', category: 'Snacks', price: 20, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', available: true },
  { name: 'Vada Pav', description: 'Mumbai street style spicy potato burger', category: 'Snacks', price: 15, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', available: true },
  { name: 'Masala Chai', description: 'Indian spiced milk tea', category: 'Beverages', price: 15, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', available: true },
  { name: 'Cold Coffee', description: 'Chilled coffee blended with milk and ice cream', category: 'Beverages', price: 50, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', available: true },
  { name: 'Gulab Jamun (2 pcs)', description: 'Soft milk dumplings soaked in sugar syrup', category: 'Desserts', price: 30, image: 'https://images.unsplash.com/photo-1666608601565-c3e927d33a5f?w=400', available: true },
];

// Auto-seed when DB is empty
const seedMenuItems = async () => {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    await MenuItem.insertMany(SEED_ITEMS);
    console.log('✅ Menu seeded with demo items');
  }
};

// GET /api/menu
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/menu/canteen-qr — return a data-URL for the canteen UPI QR code (simple static value)
const getCanteenQr = async (req, res) => {
  try {
    // A simple static UPI string; in a real app this would come from admin settings.
    const upi = 'upi://pay?pa=canteen@upi&pn=College%20Canteen';
    const dataUrl = await require('qrcode').toDataURL(upi);
    res.json({ success: true, qr: dataUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// POST /api/menu  (Admin only — enforced in routes)
const createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/menu/:id  (Admin only)
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/menu/:id  (Admin only)
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  seedMenuItems,
  getMenuItems,
  getCanteenQr,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
