# QueueLess – Smart Canteen Management System

> A full-stack MERN web application that eliminates long queues at college canteens by allowing students to pre-order food online and receive digital tokens.

---

## Problem Statement

College canteens face daily overcrowding during peak hours. Students waste 15–30 minutes standing in queues, often missing lectures. Staff struggle to manage large volumes of manual orders simultaneously.

**QueueLess** solves this by moving the entire ordering process online — students browse the menu, add items to cart, checkout, and receive a digital token. They simply show up at the counter when their token is called.

---

## Features

### Student
- Register / Login with JWT authentication
- Browse full canteen menu with category filters and search
- Add items to cart (persisted in `localStorage`)
- Checkout with Cash or Canteen QR payment selection
- Receive a **digital token number** and **QR code** after placing order
- View last 10 orders with live status badges
- Cancel any **Pending** order before preparation starts

### Staff
- Login redirects to dedicated Staff Dashboard
- View all orders grouped by status (Pending / Preparing / Completed)
- Search orders by Token Number or Order ID
- One-click **Start Preparing** and **Mark Completed** buttons
- Live stats: pending count, preparing count, today's completions

### Admin
- Full Menu CRUD (Add, Edit, Delete, Enable/Disable items)
- User management — create, edit, and remove Staff/Admin accounts
- View all orders with filters and search
- Dashboard with real-time stats (total orders, today's orders, pending, students, menu items)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), React Router DOM, Axios, Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Styling | Plain CSS (custom design system, no frameworks) |

---

## Folder Structure

```
QueueLess/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection + DNS fix
│   ├── controllers/
│   │   ├── authController.js      # Register / Login
│   │   ├── menuController.js      # Menu CRUD + auto-seeder
│   │   ├── orderController.js     # Place / view / cancel orders
│   │   ├── staffController.js     # Staff order management
│   │   └── adminController.js     # Admin user management + stats
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect + authorizeRoles
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── staffRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── generateToken.js       # JWT generator utility
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Express entry point
│
└── frontend/
    └── src/
        ├── api/
        │   ├── axios.js            # Base Axios instance with JWT interceptor
        │   ├── auth.js
        │   ├── menu.js
        │   ├── orders.js
        │   ├── staff.js
        │   └── admin.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx         # Reusable sidebar for staff/admin
        │   ├── CartDrawer.jsx
        │   └── ConfirmDialog.jsx
        ├── context/
        │   └── CartContext.jsx     # Cart state + localStorage persistence
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── MenuPage.jsx
        │   ├── CheckoutPage.jsx
        │   ├── OrderSuccessPage.jsx
        │   ├── OrderHistoryPage.jsx
        │   ├── NotFoundPage.jsx
        │   ├── staff/
        │   │   └── StaffDashboard.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── AdminMenuPage.jsx
        │       ├── AdminUsersPage.jsx
        │       └── AdminOrdersPage.jsx
        ├── App.jsx                 # Router + PrivateRoute + RoleRoute
        ├── index.css               # Complete design system
        └── main.jsx
```

---

## Installation

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/queueless.git
cd queueless
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/queueless?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

---

## Run the Project

### Start Backend
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

On first start, the menu is automatically seeded with 11 demo Indian canteen items.

### Start Frontend
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

---

## Default Test Accounts

After running the backend, register these accounts via the API or Register page:

| Role | Email | Password |
|---|---|---|
| Student | any@email.com | min 6 chars |
| Staff | staff@queueless.com | staff123 |
| Admin | admin@queueless.com | admin123 |

> **Note:** Staff and Admin accounts should be created via Admin dashboard or directly via the `/api/auth/register` API with the `role` field set.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + get JWT token |

### Menu (Public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/menu` | Get all menu items |

### Orders (Student — JWT required)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/my` | Get my last 10 orders |
| DELETE | `/api/orders/:id` | Cancel Pending order |

### Staff (Staff/Admin — JWT required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/staff/stats` | Dashboard stats |
| GET | `/api/staff/orders` | All orders with filter/search |
| PATCH | `/api/staff/orders/:id/status` | Update order status |

### Admin (Admin only — JWT required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Full dashboard stats |
| GET/POST | `/api/admin/users` | List / create users |
| PUT/DELETE | `/api/admin/users/:id` | Update / delete user |
| GET | `/api/admin/orders` | All orders |
| GET/POST | `/api/admin/menu` | List / add menu item |
| PUT/DELETE | `/api/admin/menu/:id` | Update / delete menu item |

---

## Future Scope

- [ ] Real-time order status updates (WebSockets / SSE)
- [ ] Push notifications when order is ready
- [ ] UPI payment gateway integration
- [ ] Admin analytics dashboard with charts
- [ ] Daily/weekly order report exports (CSV/PDF)
- [ ] Multi-canteen support
- [ ] Mobile app (React Native)

---

## Screenshots

> *(Add screenshots here after deployment)*

| Page | Screenshot |
|---|---|
| Login | |
| Student Dashboard | |
| Menu Page | |
| Cart | |
| Order Success (Token + QR) | |
| Staff Dashboard | |
| Admin Dashboard | |
| Admin Menu Management | |

---

## License

MIT License — free to use for educational purposes.

---

*Built as a BSc IT college field project. Designed to be simple, readable, and fully explainable in a viva.*
