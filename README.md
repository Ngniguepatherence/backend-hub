# Hub Operating System - Backend API

Backend API server for the Hub Operating System built with Node.js, Express, and MongoDB.

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (if running locally):
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

4. Run the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Clients
- `GET /api/clients` - Get all clients (protected)
- `GET /api/clients/:id` - Get single client (protected)
- `POST /api/clients` - Create client (protected)
- `PUT /api/clients/:id` - Update client (protected)
- `DELETE /api/clients/:id` - Delete client (protected)

### Other Modules
Similar endpoints for:
- `/api/spaces`
- `/api/bookings`
- `/api/projects`
- `/api/students`
- `/api/transactions`
- `/api/employees`
- `/api/documents`
- `/api/tasks`

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   └── server.js        # Entry point
├── uploads/             # File uploads directory
├── .env                 # Environment variables
└── package.json
```

## Environment Variables

See `.env.example` for required variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_EXPIRE` - JWT expiration time
- `FRONTEND_URL` - Frontend URL for CORS

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Development

The server uses `nodemon` for auto-reload during development. Make changes and the server will automatically restart.

## Next Steps

1. Create models for remaining entities (Space, Booking, etc.)
2. Create controllers and routes for each module
3. Add file upload functionality for documents
4. Add validation using express-validator
5. Add pagination and filtering
6. Add search functionality

## Notes

- This is a starter template. You'll need to implement the remaining models and controllers following the same pattern as `Client`.
- See `BACKEND_IMPLEMENTATION_GUIDE.md` in the project root for detailed implementation instructions.

