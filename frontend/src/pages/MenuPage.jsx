import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Utensils, Star, Flame } from 'lucide-react';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import { useCart } from '../context/CartContext';
import { fetchMenu } from '../api/menu';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Desserts'];

const POPULAR_NAMES = [
  'veg burger',
  'cold coffee',
  'veg thali',
  'paneer butter masala',
  'masala dosa',
  'samosa',
  'pav bhaji',
  'brownie',
];

const getFoodImage = (item) => {
  const filename = item.name.toLowerCase().replace(/\s+/g, '-');
  try {
    return new URL(`../assets/menu/${filename}.png`, import.meta.url).href;
  } catch (e) {
    return item.image;
  }
};

const MenuSkeleton = () => (
  <div className="food-grid">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div key={idx} className="skeleton-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ height: 160, background: '#F1F5F9' }} className="skeleton-line" />
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="skeleton-line" style={{ width: '30%', height: 12 }} />
          <div className="skeleton-line" style={{ width: '60%', height: 18 }} />
          <div className="skeleton-line" style={{ width: '90%', height: 14 }} />
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton-line" style={{ width: '25%', height: 16 }} />
          <div className="skeleton-line" style={{ width: '35%', height: 32, borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>
    ))}
  </div>
);

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenu()
      .then((res) => setItems(res.data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    const matchCat = category === 'All' || item.category === category;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q));

    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}

      <div className="page">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <h1 className="page-title" style={{ marginBottom: 4 }}>Canteen Menu</h1>
              <p style={{ color: 'var(--grey-text)', fontSize: '0.875rem' }}>
                Freshly prepared food items available today ({items.length} items)
              </p>
            </div>
            <div style={{ position: 'relative', width: '100%', minWidth: 0, flex: '1 1 240px', maxWidth: 400 }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-text)' }} />
              <input
                className="search-input"
                style={{ paddingLeft: 38 }}
                placeholder="Search food, category, or ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search food items"
              />
            </div>
          </div>

          <div className="filter-tabs" role="tablist" aria-label="Food categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={category === cat}
                className={`filter-tab ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <MenuSkeleton />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '3rem', marginBottom: 8 }}>🍔</p>
              <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1.15rem' }}>No food items found.</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--grey-text)', marginTop: 4 }}>
                Try another search query or select a different category filter.
              </p>
            </div>
          ) : (
            <div className="food-grid">
              {filtered.map((item) => {
                const isPopular =
                  item.isPopular ||
                  POPULAR_NAMES.includes(item.name.toLowerCase());

                return (
                  <div key={item._id} className="food-card">
                    <div className="food-card-img">
                      <img
                        src={getFoodImage(item) || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                        alt={item.name}
                        loading="lazy"
                      />
                      {isPopular && (
                        <span className="food-popular-badge">
                          <Star size={11} fill="currentColor" /> Popular
                        </span>
                      )}
                      {!item.available && <span className="food-unavailable-badge">Out of Stock</span>}
                    </div>

                    <div className="food-card-body">
                      <span className="category-tag">{item.category}</span>
                      <h3>{item.name}</h3>
                      <p className="desc">{item.description}</p>
                    </div>

                    <div className="food-card-footer">
                      <span className="food-price">₹{item.price}</span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <ShoppingCart size={14} />
                        <span>{item.available ? 'Add' : 'Out of Stock'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuPage;
