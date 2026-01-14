# Deployment Guide

## Local Development

### Using Docker Compose (Recommended)

1. Start MySQL container:
```bash
docker-compose up -d
```

2. Install dependencies:
```bash
npm install
```

3. Push database schema:
```bash
npm run db:push
```

4. Start development server:
```bash
npm run start:dev
```

### Using Local MySQL

1. Install MySQL 8.0
2. Create database:
```sql
CREATE DATABASE todo_db;
```

3. Update `.env` with your credentials
4. Run: `npm run db:push`
5. Run: `npm run start:dev`

## Production Deployment

### Build for Production

```bash
# Install dependencies
npm install --production

# Build TypeScript
npm run build

# Start production server
npm start
```

### Environment Variables

Create `.env.production`:
```env
DATABASE_HOST=your-production-host
DATABASE_PORT=3306
DATABASE_USER=your-user
DATABASE_PASSWORD=strong-password
DATABASE_NAME=todo_db
JWT_SECRET=very-strong-random-secret-key
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=production
```

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/main.js --name todo-api

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

Build and run:
```bash
docker build -t todo-api .
docker run -p 3000:3000 --env-file .env todo-api
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Cloud Platforms

#### AWS EC2
1. Launch EC2 instance (Ubuntu 22.04)
2. Install Node.js and MySQL
3. Clone repository
4. Setup environment variables
5. Use PM2 for process management
6. Configure security groups (port 3000)

#### Heroku
```bash
# Install Heroku CLI
heroku login

# Create app
heroku create your-app-name

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build command: `npm run build`
3. Configure run command: `npm start`
4. Add MySQL database
5. Set environment variables

#### Railway
1. Connect GitHub repository
2. Add MySQL database
3. Set environment variables
4. Deploy automatically

## Database Migrations

For production, use migrations instead of push:

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

## Health Checks

Add health check endpoint in `src/app.controller.ts`:
```typescript
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

## Monitoring

### Logging
Install Winston:
```bash
npm install winston nest-winston
```

### Performance Monitoring
- New Relic
- DataDog
- Sentry

## Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Implement password hashing (bcrypt)
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable helmet for security headers
- [ ] Implement request validation
- [ ] Add API versioning
- [ ] Setup database backups

## Backup Strategy

### Database Backup
```bash
# Backup
mysqldump -u user -p todo_db > backup.sql

# Restore
mysql -u user -p todo_db < backup.sql
```

### Automated Backups
Use cron job:
```bash
0 2 * * * mysqldump -u user -p'password' todo_db > /backups/todo_$(date +\%Y\%m\%d).sql
```

## Scaling

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB)
- Deploy multiple instances
- Use Redis for session storage
- Implement caching layer

### Database Scaling
- Read replicas for read-heavy workloads
- Connection pooling
- Query optimization
- Indexing

## Troubleshooting

### Application won't start
- Check Node.js version (v16+)
- Verify environment variables
- Check database connection
- Review logs

### Database connection errors
- Verify MySQL is running
- Check credentials
- Ensure database exists
- Check firewall rules

### JWT errors
- Verify JWT_SECRET is set
- Check token expiration
- Ensure Bearer prefix in header

## Performance Optimization

1. Enable compression
2. Implement caching (Redis)
3. Use connection pooling
4. Optimize database queries
5. Add indexes to database
6. Use CDN for static assets
7. Enable gzip compression
8. Implement pagination
