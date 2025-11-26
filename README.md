# rAthena User Registration API

A RESTful API for registering users in rAthena (Ragnarok Online private server). This API provides endpoints for creating new user accounts with proper validation and database integration.

## Features

- User registration with validation
- MySQL/MariaDB integration using stored procedures
- Input validation for username, password, email, and gender
- Health check endpoint
- Error handling and proper HTTP status codes

## Prerequisites

- Node.js (v14 or higher)
- MySQL/MariaDB database with rAthena schema
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jasoncalalang/rathena-user-api.git
cd rathena-user-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root with the following variables:
```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=ragnarok
PORT=3000
```

## Database Setup

This API requires a stored procedure named `register_user` in your rAthena database. Ensure your database has the necessary schema and stored procedures configured.

## Usage

### Start the Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### API Endpoints

#### Register User
```http
POST /registerUser
Content-Type: application/json

{
  "username": "testuser",
  "password": "securepassword",
  "email": "user@example.com",
  "sex": "M"
}
```

**Parameters:**
- `username` (string, required): Account username (max 23 characters)
- `password` (string, required): Account password
- `email` (string, required): User email address
- `sex` (string, required): Gender - `M` (Male), `F` (Female), or `S` (Server)

**Success Response (201):**
```json
{
  "result": "success",
  "statusMessage": "User registered successfully"
}
```

**Error Response (400/409/500):**
```json
{
  "result": "failed",
  "statusMessage": "Error message"
}
```

#### Health Check
```http
GET /health
```

Returns server health status.

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests

## Testing

Run the test suite:
```bash
npm test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host address | `localhost` |
| `DB_USER` | Database username | `ragnarok` |
| `DB_PASSWORD` | Database password | (required) |
| `DB_NAME` | Database name | `ragnarok` |
| `PORT` | API server port | `3000` |

## Error Codes

- `400` - Bad Request (missing or invalid parameters)
- `409` - Conflict (username or email already exists)
- `500` - Internal Server Error (database or server error)

## Security Notes

- Never commit `.env` file to version control
- Use strong database passwords
- Consider implementing rate limiting for production
- Add authentication middleware for production deployments

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
