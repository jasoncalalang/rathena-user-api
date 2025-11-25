import request from 'supertest';
import { jest } from '@jest/globals';

// Mock mysql2/promise before importing app
const mockQuery = jest.fn();
const mockRelease = jest.fn();
const mockGetConnection = jest.fn();

jest.unstable_mockModule('mysql2/promise', () => ({
  default: {
    createPool: jest.fn(() => ({
      getConnection: mockGetConnection
    }))
  }
}));

// Import app after mocking
const { default: app } = await import('../app.js');

describe('POST /registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetConnection.mockResolvedValue({
      query: mockQuery,
      release: mockRelease
    });
  });

  describe('Input validation', () => {
    test('should return 400 when username is missing', async () => {
      const response = await request(app)
        .post('/registerUser')
        .send({ password: 'test123', email: 'test@test.com', sex: 'M' });

      expect(response.status).toBe(400);
      expect(response.body.result).toBe('failed');
      expect(response.body.statusMessage).toContain('username');
    });

    test('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/registerUser')
        .send({ username: 'testuser', email: 'test@test.com', sex: 'M' });

      expect(response.status).toBe(400);
      expect(response.body.result).toBe('failed');
      expect(response.body.statusMessage).toContain('password');
    });

    test('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/registerUser')
        .send({ username: 'testuser', password: 'test123', sex: 'M' });

      expect(response.status).toBe(400);
      expect(response.body.result).toBe('failed');
      expect(response.body.statusMessage).toContain('email');
    });

    test('should return 400 when sex is missing', async () => {
      const response = await request(app)
        .post('/registerUser')
        .send({ username: 'testuser', password: 'test123', email: 'test@test.com' });

      expect(response.status).toBe(400);
      expect(response.body.result).toBe('failed');
      expect(response.body.statusMessage).toContain('sex');
    });

    test('should return 400 when sex is invalid', async () => {
      const response = await request(app)
        .post('/registerUser')
        .send({ username: 'testuser', password: 'test123', email: 'test@test.com', sex: 'X' });

      expect(response.status).toBe(400);
      expect(response.body.result).toBe('failed');
      expect(response.body.statusMessage).toContain('sex');
    });

    test('should return 400 when username exceeds 23 characters', async () => {
      const response = await request(app)
        .post('/registerUser')
        .send({
          username: 'thisusernameiswaytoolong',
          password: 'test123',
          email: 'test@test.com',
          sex: 'M'
        });

      expect(response.status).toBe(400);
      expect(response.body.result).toBe('failed');
      expect(response.body.statusMessage).toContain('23');
    });
  });

  describe('Successful registration', () => {
    test('should return 201 when registration succeeds', async () => {
      mockQuery
        .mockResolvedValueOnce([]) // CALL register_user
        .mockResolvedValueOnce([[{ result: 1, message: 'User registered successfully' }]]); // SELECT @result

      const response = await request(app)
        .post('/registerUser')
        .send({ username: 'newuser', password: 'pass123', email: 'new@test.com', sex: 'M' });

      expect(response.status).toBe(201);
      expect(response.body.result).toBe('success');
      expect(response.body.statusMessage).toBe('User registered successfully');
    });

    test('should accept lowercase sex and convert to uppercase', async () => {
      mockQuery
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([[{ result: 1, message: 'User registered successfully' }]]);

      const response = await request(app)
        .post('/registerUser')
        .send({ username: 'newuser', password: 'pass123', email: 'new@test.com', sex: 'm' });

      expect(response.status).toBe(201);
      expect(mockQuery).toHaveBeenCalledWith(
        'CALL register_user(?, ?, ?, ?, @result, @message)',
        ['newuser', 'pass123', 'new@test.com', 'M']
      );
    });
  });

  describe('Duplicate username', () => {
    test('should return 409 when username already exists', async () => {
      mockQuery
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([[{ result: 0, message: 'Username already exists' }]]);

      const response = await request(app)
        .post('/registerUser')
        .send({ username: 'existinguser', password: 'pass123', email: 'test@test.com', sex: 'M' });

      expect(response.status).toBe(409);
      expect(response.body.result).toBe('failed');
      expect(response.body.statusMessage).toBe('Username already exists');
    });
  });

  describe('Database errors', () => {
    test('should return 500 when database connection fails', async () => {
      mockGetConnection.mockRejectedValueOnce(new Error('Connection failed'));

      const response = await request(app)
        .post('/registerUser')
        .send({ username: 'testuser', password: 'pass123', email: 'test@test.com', sex: 'M' });

      expect(response.status).toBe(500);
      expect(response.body.result).toBe('failed');
      expect(response.body.statusMessage).toBe('Internal server error');
    });

    test('should release connection on query error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Query failed'));

      const response = await request(app)
        .post('/registerUser')
        .send({ username: 'testuser', password: 'pass123', email: 'test@test.com', sex: 'M' });

      expect(response.status).toBe(500);
      expect(mockRelease).toHaveBeenCalled();
    });
  });
});

describe('GET /health', () => {
  test('should return ok status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
