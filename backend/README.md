# NextGen Backend API

A RESTful API built with Node.js, Express, and MySQL for managing products, categories, and user authentication.

## Features

- User authentication with JWT
- Role-based access control (User/Admin)
- CRUD operations for products and categories
- MySQL database with proper relationships
- Input validation and error handling
- Secure password hashing

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nextgen_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=30d
```

3. **Set up the database (one-time only):**
   ```bash
   npm run setup
   ```
   
   This will create the database, tables, and optionally insert sample data.
   
   > **Note:** The database setup only needs to be run once during initial project setup.
> After that, the database will be managed through normal user interactions.
> 
> 📖 **For detailed database setup instructions, see [DATABASE-SETUP.md](./DATABASE-SETUP.md)**

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

## Authentication

Protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- password (Hashed)
- role (user/admin)
- created_at
- updated_at

### Categories Table
- id (Primary Key)
- name
- description
- created_at
- updated_at

### Products Table
- id (Primary Key)
- name
- description
- price
- category_id (Foreign Key to categories.id)
- created_at
- updated_at

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and meaningful error messages.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- SQL injection prevention with parameterized queries
- CORS enabled
