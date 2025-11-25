import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'ragnarok',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ragnarok',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/registerUser', async (req, res) => {
  const { username, password, email, sex } = req.body;

  // Validate required fields
  if (!username) {
    return res.status(400).json({
      result: 'failed',
      statusMessage: 'Missing required field: username'
    });
  }

  if (!password) {
    return res.status(400).json({
      result: 'failed',
      statusMessage: 'Missing required field: password'
    });
  }

  if (!email) {
    return res.status(400).json({
      result: 'failed',
      statusMessage: 'Missing required field: email'
    });
  }

  if (!sex) {
    return res.status(400).json({
      result: 'failed',
      statusMessage: 'Missing required field: sex'
    });
  }

  // Validate sex field
  const sexUpper = sex.toUpperCase();
  if (!['M', 'F', 'S'].includes(sexUpper)) {
    return res.status(400).json({
      result: 'failed',
      statusMessage: 'Invalid sex value. Must be M, F, or S'
    });
  }

  // Validate username length
  if (username.length > 23) {
    return res.status(400).json({
      result: 'failed',
      statusMessage: 'Username must be 23 characters or less'
    });
  }

  try {
    const connection = await pool.getConnection();

    try {
      await connection.query(
        'CALL register_user(?, ?, ?, ?, @result, @message)',
        [username, password, email, sexUpper]
      );

      const [rows] = await connection.query('SELECT @result AS result, @message AS message');
      const { result, message } = rows[0];

      connection.release();

      if (result === 1) {
        return res.status(201).json({
          result: 'success',
          statusMessage: message
        });
      } else {
        return res.status(409).json({
          result: 'failed',
          statusMessage: message
        });
      }
    } catch (err) {
      connection.release();
      throw err;
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      result: 'failed',
      statusMessage: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
