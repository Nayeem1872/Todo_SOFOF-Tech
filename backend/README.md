# NestJS Todo API

A production-ready Todo API built with NestJS, MySQL, Drizzle ORM, and JWT authentication.

## Features

- ✅ RESTful API with CRUD operations
- ✅ MySQL database with Drizzle ORM
- ✅ JWT authentication middleware
- ✅ Repository pattern implementation
- ✅ Swagger API documentation
- ✅ Input validation with class-validator
- ✅ TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Edit `.env` file with your MySQL credentials:
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=todo_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
PORT=3000
```

3. Create MySQL database:
```sql
CREATE DATABASE todo_db;
```

4. Push database schema:
```bash
npm run db:push
```

## Running the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## API Documentation

Swagger documentation is available at: `http://localhost:3000/api`

## Authentication

1. Get JWT token:
```bash
POST /auth/login
{
  "username": "admin",
  "password": "password123"
}
```

2. Use the token in subsequent requests:
```
Authorization: Bearer <your_token>
```

## API Endpoints

### Auth
- `POST /auth/login` - Get JWT token

### Todos (Protected)
- `POST /todos` - Create a new todo
- `GET /todos` - Get all todos (optional status filter)
- `GET /todos/:id` - Get todo by ID
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## Example Requests

### Create Todo
```bash
curl -X POST http://localhost:3000/todos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "PENDING"
  }'
```

### Get All Todos
```bash
curl http://localhost:3000/todos \
  -H "Authorization: Bearer <token>"
```

### Filter by Status
```bash
curl http://localhost:3000/todos?status=PENDING \
  -H "Authorization: Bearer <token>"
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # JWT guard
│   ├── strategies/      # JWT strategy
│   └── auth.module.ts
├── database/            # Database configuration
│   ├── schema.ts        # Drizzle schema
│   └── database.module.ts
├── todos/               # Todos module
│   ├── dto/            # DTOs
│   ├── enums/          # Status enum
│   ├── interfaces/     # Repository interface
│   ├── repositories/   # Repository implementation
│   └── todos.module.ts
├── app.module.ts       # Root module
└── main.ts            # Application entry point
```

## Database Schema

```typescript
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

- NestJS - Progressive Node.js framework
- Drizzle ORM - TypeScript ORM
- MySQL - Relational database
- JWT - JSON Web Tokens for authentication
- Swagger - API documentation
- class-validator - Input validation
- TypeScript - Type safety
