const MenuItem = require('../models/MenuItem');

const SEED_ITEMS = [
  // BREAKFAST
  {
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato masala and served with fresh chutneys.',
    category: 'Breakfast',
    price: 50,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Plain Dosa',
    description: 'Golden crispy rice crepe served with flavorful sambar and coconut chutney.',
    category: 'Breakfast',
    price: 40,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Idli Sambar',
    description: 'Soft and fluffy steamed rice cakes served with hot lentil sambar and coconut chutney.',
    category: 'Breakfast',
    price: 35,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Medu Vada',
    description: 'Crispy deep-fried lentil donuts served with sambar and fresh coconut chutney.',
    category: 'Breakfast',
    price: 35,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Poha',
    description: 'Light flattened rice cooked with onions, mustard seeds, curry leaves, and peanuts.',
    category: 'Breakfast',
    price: 25,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Upma',
    description: 'Savory roasted semolina porridge cooked with mixed vegetables and mild spices.',
    category: 'Breakfast',
    price: 25,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    available: true,
  },

  // LUNCH
  {
    name: 'Veg Thali',
    description: 'A wholesome meal containing roti, rice, dal, vegetable curry, papad, and salad.',
    category: 'Lunch',
    price: 90,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Paneer Butter Masala',
    description: 'Soft cottage cheese cubes simmered in a rich, creamy, and mildly sweet tomato gravy.',
    category: 'Lunch',
    price: 110,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Dal Rice',
    description: 'Simple comforting yellow dal tadka served over hot steamed basmati rice.',
    category: 'Lunch',
    price: 60,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Rajma Rice',
    description: 'Classic combination of Punjabi-style kidney bean curry served with fragrant basmati rice.',
    category: 'Lunch',
    price: 70,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Veg Pulao',
    description: 'Aromatic basmati rice cooked with fresh seasonal vegetables and select whole spices.',
    category: 'Lunch',
    price: 75,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Veg Fried Rice',
    description: 'Indo-Chinese style wok-tossed basmati rice with finely chopped crunchy vegetables and soy sauce.',
    category: 'Lunch',
    price: 80,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
    available: true,
  },

  // SNACKS
  {
    name: 'Veg Burger',
    description: 'Crispy mixed vegetable patty served inside a toasted bun with lettuce and creamy mayonnaise.',
    category: 'Snacks',
    price: 50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Cheese Burger',
    description: 'Classic vegetable burger topped with a layer of melted cheddar cheese.',
    category: 'Snacks',
    price: 65,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'French Fries',
    description: 'Crispy, golden-fried potato fingers lightly salted and served with ketchup.',
    category: 'Snacks',
    price: 50,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Peri Peri Fries',
    description: 'Crispy potato fries tossed in a spicy, hot, and tangy peri peri spice mix.',
    category: 'Snacks',
    price: 60,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Samosa',
    description: 'Deep-fried pastry filled with a savory mixture of spiced potatoes and green peas.',
    category: 'Snacks',
    price: 20,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Vada Pav',
    description: "Mumbai's iconic street food featuring a spicy potato fritter inside a soft sliced bun with dry garlic chutney.",
    category: 'Snacks',
    price: 20,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Pav Bhaji',
    description: 'Thick mashed vegetable gravy served with hot, buttered soft bread rolls.',
    category: 'Snacks',
    price: 70,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Garlic Bread',
    description: 'Toasted French bread slices brushed with garlic butter and Italian herbs.',
    category: 'Snacks',
    price: 55,
    image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=600&auto=format&fit=crop&q=80',
    available: true,
  },

  // BEVERAGES
  {
    name: 'Masala Chai',
    description: 'Hot brewed tea made with milk, ginger, cardamom, and strong tea leaves.',
    category: 'Beverages',
    price: 15,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Hot Coffee',
    description: 'Classic frothy hot coffee brewed with milk and aromatic coffee powder.',
    category: 'Beverages',
    price: 25,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Cold Coffee',
    description: 'Chilled milk blended with coffee powder, sugar, and a scoop of vanilla ice cream.',
    category: 'Beverages',
    price: 50,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Lemon Soda',
    description: 'Refreshing fizzy drink made with fresh lemon juice, sugar, salt, and soda.',
    category: 'Beverages',
    price: 30,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Coca Cola',
    description: 'Chilled carbonated soft drink served in a can or bottle.',
    category: 'Beverages',
    price: 30,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Sprite',
    description: 'Chilled lemon-lime flavored carbonated soft drink.',
    category: 'Beverages',
    price: 30,
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80',
    available: true,
  },

  // DESSERTS
  {
    name: 'Gulab Jamun',
    description: 'Sweet, melt-in-mouth milk solid dumplings fried and soaked in cardamom sugar syrup.',
    category: 'Desserts',
    price: 35,
    image: 'https://images.unsplash.com/photo-1666608601565-c3e927d33a5f?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Brownie',
    description: 'Rich, chewy, and warm chocolate brownie loaded with cocoa flavor.',
    category: 'Desserts',
    price: 60,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Chocolate Pastry',
    description: 'Soft and moist chocolate sponge cake layered with rich chocolate fudge frosting.',
    category: 'Desserts',
    price: 50,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    name: 'Vanilla Ice Cream',
    description: 'Classic creamy vanilla flavored ice cream served in a cup or cone.',
    category: 'Desserts',
    price: 40,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    available: true,
  },
];

// Auto-seed when DB does not have exactly 30 items
const seedMenuItems = async () => {
  const count = await MenuItem.countDocuments();
  if (count !== 30) {
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(SEED_ITEMS);
    console.log('✅ Menu re-seeded with exactly 30 official college canteen items');
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

// GET /api/menu/canteen-qr — return a data-URL for the canteen UPI QR code
const getCanteenQr = async (req, res) => {
  try {
    const upi = 'upi://pay?pa=canteen@upi&pn=College%20Canteen';
    const dataUrl = await require('qrcode').toDataURL(upi);
    res.json({ success: true, qr: dataUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/menu (Admin only)
const createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/menu/:id (Admin only)
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/menu/:id (Admin only)
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
  deleteMenuItem,
};
