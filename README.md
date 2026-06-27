# User Auth API

A production-ready REST API built with 
Node.js and PostgreSQL.

## Features
- User Registration & Login
- JWT Authentication
- Password Hashing with bcrypt
- Protected Routes
- Full CRUD Operations
- PostgreSQL Database

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- JWT
- bcryptjs
- dotenv

## API Endpoints

| Method | Route                  | Access  |
|--------|------------------------|---------|
| POST   | /api/auth/register     | Public  |
| POST   | /api/auth/login        | Public  |
| GET    | /api/users/profile     | Private |
| GET    | /api/users             | Private |
| PUT    | /api/users/:id         | Private |
| DELETE | /api/users/:id         | Private |

## Setup Instructions
1. Clone the repository
2. Run npm install
3. Create .env file
4. Setup PostgreSQL database
5. Run npm run dev