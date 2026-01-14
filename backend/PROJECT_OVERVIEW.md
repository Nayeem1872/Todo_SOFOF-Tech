# NestJS Todo API - Project Overview

## Architecture

This project follows clean architecture principles with clear separation of concerns:

### 1. Repository Pattern
- **Interface**: `TodoRepository` defines the contract
- **Implementation**: `TodoRepositoryImpl` implements the interface using Drizzle ORM
- **Benefits**: Easy to test, swap implementations, and maintain

### 2. Dependency Injection
- All dependencies are injected via NestJS DI container
- Repository is injected into Service
- Service is injected into Controller

### 3. JWT Authentication Middleware
- All `/todos` endpoints are protected with `@UseGuards(JwtAuthGuard)`
- JWT token must be included in Authorization header
- Token validation happens at middleware level

### 4. Database Layer
- **ORM**: Drizzle ORM (lightweight, type-safe)
- **Database**: MySQL 8.0
- **Schema**: Defined in `src/database/schema.ts`
- **Connection**: Global module pattern for database connection

## Key Features Implemented

✅ **CRUD Operations**
- POST /todos - Create todo
- GET /todos - List all todos with optional status filter
- GET /todos/:id - Get single todo
- PUT /todos/:id - Update todo
- DELETE /todos/:id - Delete todo

✅ **Authentication**
- POST /auth/login - Get JWT token
- JWT middleware protection on all todo endpoints

✅ **Data Validation**
- class-validator for DTO validation
- Automatic validation pipe in main.ts

✅ **API Documentation**
- Swagger UI at /api endpoint
- All endpoints documented with decorators
- Bearer auth configuration

✅ **Todo Entity Fields**
- id: UUID (Primary Key)
- title: string (required)
- description: string (optional)
- status: enum (PENDING | IN_PROGRESS | DONE)
- createdAt: timestamp (auto)
- updatedAt: timestamp (auto-update)

## Technology Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: MySQL 8.0
- **ORM**: Drizzle ORM
- **Authentication**: JWT (passport-jwt)
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Runtime**: Node.js

## Project Structure

```
nestjs-todo-app/
├── src/
│   ├── auth/                      # Authentication module
│   │   ├── dto/
│   │   │   └── login.dto.ts      # Login request DTO
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts # JWT guard
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts   # JWT strategy
│   │   ├── auth.controller.ts    # Auth endpoints
│   │   ├── auth.service.ts       # Auth business logic
│   │   └── auth.module.ts        # Auth module
│   │
│   ├── database/                  # Database configuration
│   │   ├── schema.ts             # Drizzle schema
│   │   └── database.module.ts    # DB connection module
│   │
│   ├── todos/                     # Todos module
│   │   ├── dto/
│   │   │   ├── create-todo.dto.ts
│   │   │   └── update-todo.dto.ts
│   │   ├── enums/
│   │   │   └── todo-status.enum.ts
│   │   ├── interfaces/
│   │   │   └── todo-repository.interface.ts
│   │   ├── repositories/
│   │   │   └── todo.repository.ts
│   │   ├── todos.controller.ts   # Todo endpoints
│   │   ├── todos.service.ts      # Todo business logic
│   │   └── todos.module.ts       # Todo module
│   │
│   ├── app.module.ts             # Root module
│   └── main.ts                   # Application entry
│
├── drizzle/                      # Generated migrations
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── docker-compose.yml            # MySQL container
├── drizzle.config.ts             # Drizzle configuration
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── setup.sql                     # Database setup script
├── postman-collection.json       # API testing collection
├── README.md                     # Main documentation
├── QUICKSTART.md                 # Quick start guide
└── PROJECT_OVERVIEW.md           # This file

```

## Design Decisions

### Why Drizzle ORM?
- Lightweight and fast
- Type-safe queries
- No decorators needed
- Better performance than TypeORM
- Modern and actively maintained

### Why Repository Pattern?
- Separation of concerns
- Easy to test (mock repository)
- Can swap database implementations
- Clean architecture principle

### Why JWT?
- Stateless authentication
- Scalable (no server-side sessions)
- Industry standard
- Easy to implement with Passport

### Why Swagger?
- Auto-generated documentation
- Interactive API testing
- Client SDK generation
- Team collaboration

## Security Considerations

1. **JWT Secret**: Change in production (use strong random string)
2. **Password Hashing**: Demo uses plain text - implement bcrypt in production
3. **CORS**: Currently open - restrict in production
4. **Rate Limiting**: Not implemented - add in production
5. **Input Validation**: Implemented with class-validator
6. **SQL Injection**: Protected by Drizzle ORM parameterized queries

## Testing the API

### Option 1: Swagger UI
1. Start the app: `npm run start:dev`
2. Open: `http://localhost:3000/api`
3. Click "Authorize" and enter JWT token
4. Test endpoints interactively

### Option 2: Postman
1. Import `postman-collection.json`
2. Set `baseUrl` variable to `http://localhost:3000`
3. Login to get token
4. Set `token` variable
5. Test all endpoints

### Option 3: cURL
See examples in QUICKSTART.md

## Next Steps for Production

1. **User Management**: Implement proper user registration/authentication
2. **Password Hashing**: Use bcrypt for password storage
3. **Refresh Tokens**: Implement refresh token mechanism
4. **Rate Limiting**: Add rate limiting middleware
5. **Logging**: Implement structured logging (Winston/Pino)
6. **Error Handling**: Global exception filter
7. **Testing**: Unit and E2E tests
8. **CI/CD**: Setup deployment pipeline
9. **Monitoring**: Add health checks and metrics
10. **Database Migrations**: Use Drizzle migrations instead of push

## Support

For issues or questions:
1. Check README.md for setup instructions
2. Review QUICKSTART.md for common tasks
3. Check Swagger docs at /api endpoint
4. Review code comments in source files
