# Quick Start Guide

## Step 1: Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Run the setup script
source setup.sql

# Or manually create database
CREATE DATABASE todo_db;
```

## Step 2: Configure Environment

Update `.env` file with your MySQL credentials:
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=todo_db
JWT_SECRET=your-secret-key
```

## Step 3: Push Database Schema

```bash
npm run db:push
```

## Step 4: Start the Application

```bash
npm run start:dev
```

## Step 5: Test the API

### 1. Get JWT Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Create a Todo
```bash
curl -X POST http://localhost:3000/todos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "PENDING"
  }'
```

### 3. Get All Todos
```bash
curl http://localhost:3000/todos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Access Swagger Documentation
Open your browser and go to: `http://localhost:3000/api`

## Default Credentials

- Username: `admin`
- Password: `password123`

## Status Values

- `PENDING` - Todo is pending
- `IN_PROGRESS` - Todo is in progress
- `DONE` - Todo is completed

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check credentials in `.env` file
- Verify database exists

### JWT Token Error
- Make sure to include `Bearer` prefix
- Check token hasn't expired (default: 1 day)
- Get a new token from `/auth/login`

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 3000
