# rAthena User Registration API

A RESTful API for registering users in rAthena (Ragnarok Online private server). This API provides endpoints for creating new user accounts with proper validation and database integration.

## Features

- User registration with validation
- MySQL/MariaDB integration using stored procedures
- Input validation for username, password, email, and gender
- Health check endpoint
- Error handling and proper HTTP status codes

## Prerequisites

- Node.js (v14 or higher) OR Docker
- MySQL/MariaDB database with rAthena schema
- npm or yarn package manager (for local development)

## Installation

### Option 1: Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/jasoncalalang/rathena-user-api.git
cd rathena-user-api
```

2. Create a `.env` file from the template:
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration:
```env
DB_HOST=db
DB_USER=ragnarok
DB_PASSWORD=your_secure_password
DB_NAME=ragnarok
PORT=3000
```

4. Start with Docker Compose (includes MariaDB):
```bash
docker compose up -d
```

Or build and run just the API container (requires external database):
```bash
docker build -t rathena-user-api .
docker run -d --name rathena-api \
  -p 3000:3000 \
  -e DB_HOST=your_db_host \
  -e DB_USER=ragnarok \
  -e DB_PASSWORD=your_password \
  -e DB_NAME=ragnarok \
  rathena-user-api
```

5. Verify the container is running:
```bash
docker compose ps
curl http://localhost:3000/health
```

### Option 2: Local Installation

1. Clone the repository:
```bash
git clone https://github.com/jasoncalalang/rathena-user-api.git
cd rathena-user-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the template:
```bash
cp .env.example .env
```

4. Edit `.env` with your database configuration:
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

## Docker Commands

### Using Docker Compose

```bash
# Start all services (API + Database)
docker compose up -d

# View logs
docker compose logs -f api

# Stop all services
docker compose down

# Stop and remove volumes (deletes database data)
docker compose down -v

# Rebuild after code changes
docker compose build
docker compose up -d
```

### Using Docker Standalone

```bash
# Build the image
docker build -t rathena-user-api .

# Run container
docker run -d --name rathena-api \
  -p 3000:3000 \
  --env-file .env \
  rathena-user-api

# View logs
docker logs -f rathena-api

# Stop container
docker stop rathena-api

# Remove container
docker rm rathena-api
```

### Health Check

```bash
# Check API health
curl http://localhost:3000/health
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host address | `localhost` (local) / `db` (Docker) |
| `DB_USER` | Database username | `ragnarok` |
| `DB_PASSWORD` | Database password | (required) |
| `DB_NAME` | Database name | `ragnarok` |
| `PORT` | API server port | `3000` |
| `DB_ROOT_PASSWORD` | MariaDB root password (Docker only) | `rootpassword` |

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
