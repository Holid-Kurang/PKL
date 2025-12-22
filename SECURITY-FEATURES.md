# Security & Configuration Features

## ✅ Features Implemented

### 1. **Helmet Security Headers**

-   Protects against common web vulnerabilities
-   Content Security Policy (CSP) configured
-   HSTS (HTTP Strict Transport Security) enabled
-   XSS protection
-   Frame options set to prevent clickjacking

### 2. **Logging System (Winston + Morgan)**

-   **Morgan**: HTTP request logging
    -   Development: colored console output
    -   Production: logs to file via Winston
-   **Winston**: Application logging
    -   `logs/error.log`: Error level logs only
    -   `logs/combined.log`: All logs
    -   Console logging with colors in development
    -   Automatic log rotation (5MB max, 5 files)

### 3. **Health Check Endpoint**

-   **URL**: `GET /health`
-   Returns:
    ```json
    {
    	"uptime": 12345.67,
    	"message": "OK",
    	"timestamp": 1703250000000,
    	"environment": "development",
    	"database": "connected"
    }
    ```

### 4. **Rate Limiting**

-   **General Rate Limit**: 5000 requests per 15 minutes
-   **Login Rate Limit**: 5 attempts per 15 minutes (more strict)
-   Configurable via environment variables
-   Logs rate limit violations

### 5. **Session Management**

-   Sessions stored in MongoDB using `connect-mongo`
-   Secure session secrets from environment
-   Cookie security features:
    -   `httpOnly`: Prevents XSS attacks
    -   `sameSite: 'lax'`: CSRF protection
    -   `secure`: HTTPS only in production
-   Session expires in 5 minutes

### 6. **Environment Variables (.env.example)**

All required configuration variables are documented in `.env.example`

## 📝 Setup Instructions

### 1. Create your .env file

```bash
cp .env.example .env
```

### 2. Update .env with your values

```env
# IMPORTANT: Change these values!
SESSION_SECRET=generate-a-strong-random-secret-here
MONGODB_URI=mongodb://localhost:27017/your_actual_database
```

**Generate a strong session secret:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the application

```bash
# Development
npm run dev

# Production
npm start
```

## 🧪 Testing

### Test Health Check

```bash
curl http://localhost:3000/health
```

### Test Rate Limiting

```bash
# This should eventually hit rate limit
for i in {1..10}; do curl http://localhost:3000/login; done
```

## 📊 Monitoring Logs

### View all logs

```bash
tail -f logs/combined.log
```

### View error logs only

```bash
tail -f logs/error.log
```

## 🔒 Security Best Practices

1. **Never commit .env file** ✅ (already in .gitignore)
2. **Use strong session secrets** - generate with crypto
3. **Keep dependencies updated** - run `npm audit` regularly
4. **Monitor logs** - check for suspicious activity
5. **Use HTTPS in production** - set `NODE_ENV=production`

## 📁 New Files & Directories

```
├── .env.example           # Environment variables template
├── logs/                  # Log files (git-ignored)
│   ├── combined.log      # All logs
│   ├── error.log         # Error logs only
│   └── .gitignore        # Ignore log files
└── src/
    └── utils/
        └── logger.js     # Winston logger configuration
```

## 🛠️ Configuration

### Environment Variables

| Variable                  | Default     | Description                              |
| ------------------------- | ----------- | ---------------------------------------- |
| `PORT`                    | 3000        | Server port                              |
| `NODE_ENV`                | development | Environment mode                         |
| `MONGODB_URI`             | -           | MongoDB connection string                |
| `SESSION_SECRET`          | -           | Secret for session encryption            |
| `LOG_LEVEL`               | info        | Logging level (error, warn, info, debug) |
| `RATE_LIMIT_WINDOW_MS`    | 900000      | Rate limit window (15 min)               |
| `RATE_LIMIT_MAX_REQUESTS` | 5000        | Max requests per window                  |
| `RATE_LIMIT_LOGIN_MAX`    | 5           | Max login attempts per window            |

## 🚀 Production Deployment Checklist

-   [ ] Set `NODE_ENV=production`
-   [ ] Generate strong `SESSION_SECRET`
-   [ ] Configure proper `MONGODB_URI`
-   [ ] Set up log rotation/monitoring
-   [ ] Enable HTTPS
-   [ ] Configure firewall rules
-   [ ] Set up monitoring alerts
-   [ ] Review and adjust rate limits

## 📖 Additional Resources

-   [Helmet.js Documentation](https://helmetjs.github.io/)
-   [Winston Logger](https://github.com/winstonjs/winston)
-   [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)
-   [Connect MongoDB Session Store](https://github.com/jdesboeufs/connect-mongo)
