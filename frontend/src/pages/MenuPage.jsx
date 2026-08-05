import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Utensils } from 'lucide-react';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import { useCart } from '../context/CartContext';
import { fetchMenu } from '../api/menu';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Desserts'];

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenu()
      .then((res) => setItems(res.data.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    const matchCat = category === 'All' || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.description.toLowerCase().includes(search.toLowerCase());
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
              <p style={{ color: 'var(--grey-text)', fontSize: '0.875rem' }}>Freshly prepared food items available today</p>
            </div>
            <div style={{ position: 'relative', minWidth: 260, flex: '1', maxWidth: 400 }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-text)' }} />
              <input
                className="search-input"
                style={{ paddingLeft: 38 }}
                placeholder="Search food or ingredients..."
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
            <div className="loading-box"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Utensils size={40} style={{ color: 'var(--grey-text)', margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 600, color: 'var(--text)' }}>No items found</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--grey-text)', marginTop: 4 }}>
                Try adjusting your search query or selecting a different category filter.
              </p>
            </div>
          ) : (
            <div className="food-grid">
              {filtered.map((item) => (
                <div key={item._id} className="food-card">
                  <div className="food-card-img">
                    <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} alt={item.name} loading="lazy" />
                    {!item.available && <span className="food-unavailable-badge">Sold Out</span>}
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
                      <span>{item.available ? 'Add' : 'Unavailable'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuPage;
