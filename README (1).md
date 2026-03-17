# 🛒 ShopNova — Full Stack E-Commerce Platform

<div align="center">

![ShopNova Banner](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop&q=80)

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.3-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)

A complete full-stack e-commerce web application with separate Admin and User interfaces, JWT authentication, and real-time product management.

</div>

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Default Credentials](#-default-credentials)
- [Deployment](#-deployment)

---

## ✨ Features

### 👑 Admin Panel
| Feature | Description |
|---------|-------------|
| 📊 Dashboard | Revenue stats, recent orders, live activity feed |
| 📦 Product Management | Add, edit, delete products with images via API |
| 🛒 Order Management | View and track all orders with status updates |
| 👥 User Management | Activate/deactivate user accounts |
| 📈 Analytics | Sales charts, category breakdown, top products |
| ⚙️ Settings | 6 themes, profile, notifications, security |

### 👤 User Side
| Feature | Description |
|---------|-------------|
| 🏠 Home Page | Hero banner, featured products, categories |
| 🛍️ Shop Page | Browse all products with filter, sort & search |
| 🛒 Cart | Add/remove items, coupon codes, order summary |
| 📦 My Orders | Order tracking with status timeline |
| 👤 Profile | Edit info, address, change password |

### 🔐 Security
- JWT-based authentication
- Role-based access control (ADMIN / USER)
- Protected routes on frontend
- BCrypt password encryption
- CORS configured

---

## 🛠 Tech Stack

### Frontend
```
React 18        → UI Framework
Vite 5          → Build Tool
React Router 6  → Client-side Routing
CSS-in-JS       → Styling (no external CSS library)
Sora Font       → Typography
```

### Backend
```
Spring Boot 3.2   → REST API Framework
Spring Security   → Authentication & Authorization
Spring Data JPA   → Database ORM
Hibernate         → SQL mapping
JWT (jjwt)        → Token-based Auth
Lombok            → Boilerplate reduction
Maven             → Build Tool
```

### Database
```
MySQL 8.0         → Primary Database
Tables: users, products, orders
```

---

## 📁 Project Structure

```
ShopNova/
│
├── 📂 frontend/                     # React + Vite App
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                  # Routes
│       ├── main.jsx                 # Entry point
│       ├── components/
│       │   ├── AdminRoute.jsx       # Admin guard
│       │   ├── ProtectedRoute.jsx   # Auth guard
│       │   └── Layout.jsx           # Shared layout
│       ├── context/
│       │   └── AuthContext.jsx      # Auth state
│       ├── services/
│       │   ├── authService.js       # Login/Register API
│       │   ├── productService.js    # Product CRUD API
│       │   └── dashboardService.js  # Dashboard API
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── admin/               # Admin pages
│           │   ├── Dashboard.jsx
│           │   ├── Products.jsx
│           │   ├── Orders.jsx
│           │   ├── Users.jsx
│           │   ├── Analytics.jsx
│           │   └── Settings.jsx
│           └── user/                # User pages
│               ├── Home.jsx
│               ├── Shop.jsx
│               ├── Cart.jsx
│               ├── MyOrders.jsx
│               ├── Profile.jsx
│               └── UserNavbar.jsx
│
└── 📂 backend/                      # Spring Boot App
    ├── pom.xml
    └── src/main/
        ├── resources/
        │   └── application.properties
        └── java/com/ecommerce/
            ├── ShopNovaApplication.java
            ├── config/
            │   ├── JwtUtil.java
            │   ├── SecurityConfig.java
            │   └── DataSeeder.java
            ├── security/
            │   └── JwtAuthFilter.java
            ├── controller/
            │   ├── AuthController.java
            │   ├── ProductController.java
            │   ├── OrderController.java
            │   └── DashboardController.java
            ├── service/
            │   └── UserDetailsServiceImpl.java
            ├── model/
            │   ├── User.java
            │   ├── Product.java
            │   └── Order.java
            └── repository/
                ├── UserRepository.java
                ├── ProductRepository.java
                └── OrderRepository.java
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|------|---------|----------|
| Java | 17+ | https://www.oracle.com/java/technologies/downloads/#java17 |
| Maven | 3.8+ | https://maven.apache.org/download.cgi |
| Node.js | 18+ | https://nodejs.org |
| MySQL | 8.0+ | https://dev.mysql.com/downloads/ |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/ESaiAnurath/ShopNova_E-Commerece.git
cd ShopNova_E-Commerece
```

---

### Step 2 — Setup MySQL Database

Open MySQL Workbench or terminal and run:

```sql
CREATE DATABASE shopnova_db;
```

---

### Step 3 — Configure Backend

Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shopnova_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD   ← change this
```

---

### Step 4 — Run Backend

```bash
cd backend
mvn spring-boot:run
```

Wait until you see:
```
Started ShopNovaApplication on port 8080
✅ Default admin created: admin@shopnova.com / admin123
```

Backend runs at → **http://localhost:8080**

---

### Step 5 — Run Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → **http://localhost:3000**

---

### Step 6 — Open in Browser

```
http://localhost:3000
```

---

## 🔑 Default Credentials

| Role | Email | Password | Redirects To |
|------|-------|----------|-------------|
| 👑 Admin | admin@shopnova.com | admin123 | /dashboard |
| 👤 User | register a new account | your choice | /home |

### Promote yourself to Admin

Using MySQL Workbench:
```sql
USE shopnova_db;
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Or using the API:
```bash
curl -X POST http://localhost:8080/api/auth/make-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","secretCode":"SHOPNOVA_ADMIN_2024"}'
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | ❌ | Login and get JWT token |
| POST | /api/auth/register | ❌ | Register new user |
| POST | /api/auth/make-admin | ❌ | Promote user to admin |
| POST | /api/auth/logout | ✅ | Logout |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | ❌ | Get all products |
| GET | /api/products?category=Electronics | ❌ | Filter by category |
| GET | /api/products?search=watch | ❌ | Search products |
| GET | /api/products/{id} | ❌ | Get single product |
| POST | /api/products | ✅ | Add new product |
| PUT | /api/products/{id} | ✅ | Update product |
| DELETE | /api/products/{id} | ✅ | Delete product |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/dashboard/stats | ✅ | Get dashboard statistics |
| GET | /api/orders | ✅ | Get all orders |

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Upload dist/ folder to Vercel
# OR connect GitHub repo for auto-deploy
```

Set environment variable in Vercel:
```
VITE_API_URL = https://your-backend-url.railway.app/api
```

### Backend → Railway / Render

```bash
cd backend
mvn clean package -DskipTests
# Upload the generated JAR from target/ folder
```

Set environment variables:
```
SPRING_DATASOURCE_URL = jdbc:mysql://your-cloud-db/shopnova_db
SPRING_DATASOURCE_USERNAME = cloud_username
SPRING_DATASOURCE_PASSWORD = cloud_password
```

### Database → PlanetScale / Railway MySQL

Create a cloud MySQL database and update the connection URL in backend.

---

## 🎨 UI Themes

The admin settings panel includes 6 built-in themes:

| Theme | Colors |
|-------|--------|
| Purple Cyan (Default) | #6C63FF + #3ECFCF |
| Sunset | #FF6B35 + #FF6B9D |
| Ocean | #00C9A7 + #4FACFE |
| Fire | #FFD166 + #FF4757 |
| Candy | #FF9FF3 + #A29BFE |
| Minimal | #ffffff + #888888 |

---

## 👨‍💻 Author

**E Sai Anurath**
- GitHub: [@ESaiAnurath](https://github.com/ESaiAnurath)
- Project: [ShopNova E-Commerce](https://github.com/ESaiAnurath/ShopNova_E-Commerece)

---

## 📄 License

This project is for educational purposes as part of a DevOps & Full Stack Development course.

---

<div align="center">
  Made with ❤️ using React + Spring Boot + MySQL
</div>
