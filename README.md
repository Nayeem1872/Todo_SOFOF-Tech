# Todo_SOFOF-Tech

A full-stack Todo application with NestJS backend and Next.js frontend.

## Project Structure

```
.
├── backend/          # NestJS API with MySQL and JWT authentication
├── frontend/         # Next.js UI with TypeScript and Tailwind CSS
├── docker-compose.yml # MySQL database setup
└── README.md         # This file
```

## Features

### Backend (NestJS)
- ✅ RESTful API with CRUD operations
- ✅ MySQL database with Drizzle ORM
- ✅ JWT authentication middleware
- ✅ Repository pattern implementation
- ✅ Swagger API documentation
- ✅ Input validation with class-validator
- ✅ TypeScript support

### Frontend (Next.js)
- ✅ Modern, elegant UI with smooth animations
- ✅ Task management with status tracking
- ✅ Drag & drop reordering
- ✅ Undo/Redo functionality
- ✅ Filtering by status
- ✅ Responsive design
- ✅ Framer Motion animations

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

## Quick Start

### 1. Setup MySQL Database

Start the MySQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a MySQL 8.0 container on port 3306.

### 2. Setup Backend

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Push database schema
npm run db:push

# Start the backend server
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api`

### 3. Setup Frontend

```bash
cd frontend
npm install

# Start the frontend development server
npm run dev
```

The frontend will be available at `http://localhost:3001`

## API Endpoints

### Auth
- `POST /auth/login` - Get JWT token

### Todos (Protected)
- `POST /todos` - Create a new todo
- `GET /todos` - Get all todos (optional status filter)
- `GET /todos/:id` - Get todo by ID
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## Authentication

1. Get JWT token:
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

2. Use the token in subsequent requests:
```
Authorization: Bearer <your_token>
```

## Environment Variables

### Backend (.env)
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=todo_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
PORT=3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Database Schema

```sql
todos {
  id: UUID (Primary Key)
  title: VARCHAR(255) NOT NULL
  description: TEXT
  status: ENUM('PENDING', 'IN_PROGRESS', 'DONE') DEFAULT 'PENDING'
  createdAt: TIMESTAMP DEFAULT NOW()
  updatedAt: TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
}
```

## Technologies Used

### Backend
- NestJS - Progressive Node.js framework
- Drizzle ORM - TypeScript ORM
- MySQL - Relational database
- JWT - JSON Web Tokens for authentication
- Swagger - API documentation
- class-validator - Input validation

### Frontend
- Next.js 15 - React framework with App Router
- React 19 - UI library
- TypeScript - Type safety
- Framer Motion - Animations and gestures
- Tailwind CSS - Styling
- Lucide React - Icons

## Development

### Backend Development
```bash
cd backend
npm run start:dev  # Start in watch mode
npm run build      # Build for production
npm start          # Start production server
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
```

## Testing the API

A test script is provided in the backend:

```bash
cd backend
./test-api.sh
```

Or use the Postman collection: `backend/postman-collection.json`


## Author

Built for SOFOF-Tech
