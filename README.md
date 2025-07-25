# TrackCTA - Chicago Transit Authority Real-Time Tracker

[![CI/CD Pipeline](https://github.com/ambicuity/trackCTA/actions/workflows/ci.yml/badge.svg)](https://github.com/ambicuity/trackCTA/actions/workflows/ci.yml)
[![Security Audit](https://github.com/ambicuity/trackCTA/actions/workflows/security.yml/badge.svg)](https://github.com/ambicuity/trackCTA/actions/workflows/security.yml)
[![Deploy](https://github.com/ambicuity/trackCTA/actions/workflows/deploy.yml/badge.svg)](https://github.com/ambicuity/trackCTA/actions/workflows/deploy.yml)

An internationalized web application designed to track and predict Chicago Transit Authority (CTA) buses and trains in real-time. This comprehensive platform provides accurate arrival times, route information, and notifications for delays, ensuring a smooth and efficient commuting experience for users worldwide.

## 🚀 Features

- **Real-time tracking** of CTA buses and trains
- **Multi-language support** (English, Spanish, Chinese)
- **Route visualization** with interactive maps
- **Arrival predictions** with machine learning models
- **Delay notifications** and service alerts
- **Responsive design** for mobile and desktop
- **Offline capabilities** for essential features
- **Accessibility compliant** (WCAG 2.1 AA)

## 🏗️ Architecture

This application follows a microservices architecture with the following components:

```
trackCTA/
├── server/          # Express.js API server
├── client/          # React TypeScript client app
├── web-app/         # Additional React client (legacy)
├── data-store/      # Data processing and storage service
├── locale-builder/  # Internationalization tool
└── .github/         # CI/CD workflows and automation
```

### Technology Stack

**Frontend:**
- React 17+ with TypeScript
- Chakra UI for design system
- React Router for navigation
- i18next for internationalization
- Socket.io for real-time updates

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Socket.io for WebSocket connections
- Node-cache for in-memory caching
- Axios for external API calls

**DevOps & Tools:**
- GitHub Actions for CI/CD
- Jest for testing
- ESLint for code quality
- Docker for containerization
- Firebase for deployment

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 16.x or higher)
- **npm** or **yarn** package manager
- **MongoDB** database
- **CTA API Key** from [CTA Developer Portal](https://www.transitchicago.com/developers/)
- **Google Translate API Key** (optional, for locale building)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/ambicuity/trackCTA.git
cd trackCTA
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install --legacy-peer-deps

# Install data-store dependencies
cd ../data-store && npm install

# Install locale-builder dependencies
cd ../locale-builder && npm install
```

### 3. Set up environment variables

Create `.env` files in each service directory:

**server/.env:**
```env
PORT=5000
CTA_KEY=your_cta_api_key_here
MONGODB_URI=mongodb://localhost:27017/trackcta
GITHUB_TOKEN=your_github_token
GITHUB_WORKFLOW_WEB_URL=https://api.github.com/repos/ambicuity/trackCTA/actions/workflows/web.yml/runs
GITHUB_WORKFLOW_SERVER_URL=https://api.github.com/repos/ambicuity/trackCTA/actions/workflows/server.yml/runs
GITHUB_VERSION_URL=https://api.github.com/repos/ambicuity/trackCTA/releases/latest
SENDGRID_API_KEY=your_sendgrid_api_key
```

**client/.env:**
```env
REACT_APP_BASE_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**data-store/.env:**
```env
MONGODB_URI=mongodb://localhost:27017/trackcta
CTA_KEY=your_cta_api_key_here
```

**locale-builder/.env:**
```env
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
```

### 4. Start the services

#### Development Mode

```bash
# Terminal 1: Start MongoDB (if running locally)
mongod

# Terminal 2: Start the API server
cd server && npm run dev

# Terminal 3: Start the client app
cd client && npm start

# Terminal 4: Build locales (optional)
cd locale-builder && npm start
```

#### Production Mode

```bash
# Build client
cd client && npm run build

# Start server
cd server && npm start
```

The application will be available at:
- **Client App**: http://localhost:3000
- **API Server**: http://localhost:5000
- **API Documentation**: http://localhost:5000/v1/api

## 🧪 Testing

### Running Tests

```bash
# Run all server tests
cd server && npm test

# Run client tests with coverage
cd client && npm test -- --coverage --watchAll=false

# Run tests in watch mode
cd server && npm test -- --watch
```

### Test Coverage

The project maintains comprehensive test coverage:

- **Server API**: Unit and integration tests for all endpoints
- **Client Components**: React component testing with React Testing Library
- **Service Layer**: Mock testing for external API calls
- **Cache Layer**: Redis/Node-cache testing
- **Database**: MongoDB integration testing

### Continuous Integration

GitHub Actions automatically runs tests on:
- Every pull request
- Pushes to main/develop branches
- Scheduled security audits

## 📊 API Documentation

### Bus Routes API

```http
GET /v1/api/routes
```

**Query Parameters:**
- `search` (string): Search routes by name or number
- `filter` (string): Comma-separated route IDs to exclude
- `limit` (number): Results per page (default: 10)
- `index` (number): Page number (default: 1)

**Response:**
```json
[
  {
    "route": "1",
    "name": "Bronzeville/Union Station",
    "color": "#336633",
    "type": "B"
  }
]
```

### Real-time Predictions

```http
GET /v1/api/predictions?stop={stopId}
```

**Response:**
```json
[
  {
    "type": "A",
    "name": "Halsted & North",
    "stopId": "456",
    "route": "8",
    "direction": "Northbound",
    "destination": "Jefferson Park",
    "time": 5,
    "timestamp": "2:15 PM",
    "delayed": false
  }
]
```

### Train Routes API

```http
GET /v1/api/train/routes
```

**Response:**
```json
[
  {
    "route": "red",
    "name": "Red Line",
    "color": "#c60c30",
    "type": "T"
  }
]
```

For complete API documentation, visit `/v1/api/docs` when the server is running.

## 🌐 Internationalization

The application supports multiple languages through i18next:

### Supported Languages
- **English** (en) - Default
- **Spanish** (es)
- **Chinese** (zh)

### Adding New Languages

1. Create translation files in `locale-builder/resources/`
2. Run the locale builder: `cd locale-builder && npm start`
3. Add language to client configuration
4. Update language selector component

### Translation Structure

```json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Try Again"
  },
  "routes": {
    "title": "Routes",
    "search": "Search routes..."
  }
}
```

## 🚀 Deployment

### Production Deployment

1. **Build the application:**
```bash
cd client && npm run build
cd ../server && npm install --production
```

2. **Deploy to your preferred platform:**
   - **Firebase**: `firebase deploy`
   - **Heroku**: Configure buildpacks for Node.js
   - **AWS**: Use Elastic Beanstalk or EC2
   - **Google Cloud**: Use App Engine or Cloud Run

3. **Set environment variables** in your deployment platform

### Docker Deployment

```dockerfile
# Dockerfile.server
FROM node:16-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build and run with Docker
docker build -f Dockerfile.server -t trackcta-server .
docker run -p 5000:5000 --env-file server/.env trackcta-server
```

### Environment Configuration

Set these environment variables in production:
- Database connection strings
- API keys for external services
- Security tokens and secrets
- Feature flags
- Monitoring and logging configurations

## 🔒 Security

### Security Features

- **API Rate Limiting**: Prevents abuse and ensures fair usage
- **Input Validation**: All user inputs are sanitized and validated
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Sensitive data stored securely
- **Dependency Scanning**: Automated vulnerability detection
- **Security Headers**: Proper HTTP security headers implemented

### Security Best Practices

1. **Never commit sensitive data** to version control
2. **Use environment variables** for configuration
3. **Keep dependencies updated** with `npm audit`
4. **Implement proper authentication** for admin features
5. **Use HTTPS** in production
6. **Regularly scan for vulnerabilities**

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Run the test suite**: `npm test`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Coding Standards

- **JavaScript/TypeScript**: Follow ESLint configuration
- **React**: Use functional components with hooks
- **Testing**: Maintain 80%+ test coverage
- **Documentation**: Update README for significant changes
- **Git**: Use conventional commit messages

### Code Review Process

1. Automated tests must pass
2. Security scan must pass
3. Code review by maintainer required
4. Documentation updated if needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chicago Transit Authority** for providing the public API
- **React Community** for the amazing ecosystem
- **Contributors** who have helped improve this project
- **Transit enthusiasts** who use and test the application

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the maintainers for security issues

### Reporting Issues

When reporting issues, please include:
- Operating system and browser version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Error messages or logs

### Feature Requests

We love feature requests! Please:
- Check if the feature already exists
- Describe the use case clearly
- Explain how it benefits users
- Consider contributing the implementation

---

**Made with ❤️ for Chicago commuters**
