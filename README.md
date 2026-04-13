# 🛒 E-Commerce REST API

A production-ready E-Commerce REST API built with **Node.js**, **Express**, **MongoDB (Mongoose)**, featuring **JWT Authentication**, **Cloudinary image uploads**, **Payment mockup**, and full **Postman test coverage**.

---

## 📁 Project Structure

```
ecommerce-api/
├── config/
│   ├── db.js                  # MongoDB connection
│   └── cloudinary.js          # Cloudinary + Multer config
├── controllers/
│   ├── authController.js      # Register, Login, Profile
│   ├── productController.js   # CRUD + Image upload
│   ├── paymentController.js   # Payment mockup
│   └── orderController.js     # Order management
├── middleware/
│   ├── auth.js                # JWT protect + role authorize
│   ├── errorHandler.js        # Global error + 404 handler
│   └── validators.js          # express-validator rules
├── models/
│   ├── User.js                # User schema (bcrypt hashed pw)
│   ├── Product.js             # Product schema
│   └── Order.js               # Order schema
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── paymentRoutes.js
│   └── orderRoutes.js
├── uploads/                   # Local image fallback folder
├── .env.example               # Environment template
├── .gitignore
├── server.js                  # App entry point
├── package.json
├── ECommerce_API_Postman_Collection.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/ecommerce-api.git
cd ecommerce-api
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary credentials
```

### 3. Run
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000`

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `mysupersecretkey` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `mycloudname` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefg...` |

> **Note:** If Cloudinary vars are not set, images fall back to local `uploads/` folder.

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login & get JWT |
| GET | `/me` | User | Get own profile |
| PUT | `/me` | User | Update profile |
| PUT | `/change-password` | User | Change password |
| GET | `/users` | Admin | Get all users |

### Product Routes — `/api/products`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all products (filter, search, paginate) |
| GET | `/:id` | Public | Get single product |
| POST | `/` | Admin | Create product (with image upload) |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Soft-delete product |
| POST | `/upload/images` | Admin | Upload images standalone |

**Query Parameters for GET /api/products:**
- `keyword` — Search by name/description
- `category` — Filter by category
- `minPrice` / `maxPrice` — Price range
- `sort` — `price_asc`, `price_desc`, `newest`, `rating`
- `page` / `limit` — Pagination

### Payment Routes — `/api/payment`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/methods` | Public | List payment methods |
| POST | `/process` | User | Process payment (mockup) |
| POST | `/refund` | User | Initiate refund |
| GET | `/status/:txnId` | User | Check transaction status |

**Payment Methods:** `card`, `upi`, `netbanking`, `wallet`, `cod`

> **Test Tip:** Use card number ending in `0000` to trigger a declined response.

### Order Routes — `/api/orders`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | User | Place new order |
| GET | `/my` | User | Get own orders |
| GET | `/:id` | User/Admin | Get order by ID |
| GET | `/` | Admin | Get all orders |
| PUT | `/:id/status` | Admin | Update order status |

---

## 🔒 Authentication

All protected routes require a `Bearer` token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**User Roles:**
- `user` — Can browse products, place orders, manage own profile
- `admin` — Full access including product CRUD and order management

---

## 📤 Image Upload

Products support multi-image upload via `multipart/form-data`:

```
POST /api/products
Content-Type: multipart/form-data

Field: images (up to 5 files, max 5MB each)
Accepted types: jpg, jpeg, png, webp
```

Images are stored on **Cloudinary** (auto-resized to 800×800, quality optimized). Falls back to local disk storage if Cloudinary is not configured.

---

## 💳 Payment Mockup

The payment system simulates a real gateway:

| Scenario | How to Trigger | Expected Response |
|----------|----------------|-------------------|
| Success | Any valid card number | 200 + transaction ID |
| Declined | Card ending in `0000` | 402 + error details |
| UPI Success | Valid `name@bank` format | 200 + transaction ID |
| COD | method: `cod` | 200 + confirmation |
| Refund | POST `/refund` with txnId | 200 + refund ID |

---

## ✅ Data Validation

All inputs are validated using `express-validator`:

- **Register:** name (2–50 chars), valid email, strong password (uppercase + lowercase + number), valid phone
- **Login:** valid email + non-empty password
- **Product:** name, description (10–2000 chars), positive price, valid category enum, non-negative stock
- **Order:** non-empty items array, valid product IDs, quantity ≥ 1, full shipping address, valid payment method
- **Payment:** amount > 0, valid method, card fields for card method, UPI ID format for UPI

---

## 🧪 Postman Testing

### Import & Run

1. Open Postman → **Import** → Select `ECommerce_API_Postman_Collection.json`
2. Set collection variable `baseUrl` to your server URL
3. Run requests in order: Register → Login → Create Product → Process Payment → Create Order
4. Tokens are **auto-saved** after Login via test scripts

### Test Coverage

| Category | Test Cases |
|----------|-----------|
| Health Check | 2 |
| Authentication | 9 |
| Products | 8 |
| Payment | 7 |
| Orders | 6 |
| Error Handling | 1 |
| **Total** | **33** |

---

## 🌐 Deployment (Render)

1. Push code to GitHub (ensure `.env` is in `.gitignore`)
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set **Build Command:** `npm install`
5. Set **Start Command:** `npm start`
6. Add all environment variables from `.env`
7. Deploy!

**Alternative:** Railway.app → New Project → Deploy from GitHub → Add env vars

---

## 🛡️ Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens with configurable expiry
- **Helmet.js** — HTTP security headers
- **CORS** — Cross-origin request control
- Role-based access control (RBAC)
- Input validation on all endpoints
- Sensitive fields excluded from API responses
- Soft-delete for products (data preservation)

---

## 📊 Error Response Format

All errors follow a consistent structure:

```json
{
  "success": false,
  "message": "Human-readable error description",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address" }
  ]
}
```

HTTP status codes used: `200`, `201`, `400`, `401`, `402`, `403`, `404`, `409`, `500`
