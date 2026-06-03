// server.js - Express Backend Server for SA Attend Pro

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 3000;

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== AUTHENTICATION ROUTES ====================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO users (email, password, firstName, lastName, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, firstName, lastName, role`,
      [email, hashedPassword, firstName, lastName, role || 'employee']
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || '7d'
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      user,
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || '7d'
    });

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, firstName: user.firstName, role: user.role },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ==================== MIDDLEWARE: VERIFY TOKEN ====================

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ==================== EMPLOYEES ROUTES ====================

// Get all employees
app.get('/api/employees', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, d.name as departmentName, u.email, u.firstName, u.lastName
      FROM employees e
      LEFT JOIN departments d ON e.departmentId = d.id
      LEFT JOIN users u ON e.userId = u.id
      ORDER BY e.employeeId
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get single employee
app.get('/api/employees/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, d.name as departmentName, u.email
      FROM employees e
      LEFT JOIN departments d ON e.departmentId = d.id
      LEFT JOIN users u ON e.userId = u.id
      WHERE e.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Add employee
app.post('/api/employees', verifyToken, async (req, res) => {
  try {
    const { employeeId, userId, departmentId, designation, joinDate, salary } = req.body;

    const result = await pool.query(`
      INSERT INTO employees (employeeId, userId, departmentId, designation, joinDate, salary)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [employeeId, userId, departmentId, designation, joinDate, salary]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

// Update employee
app.put('/api/employees/:id', verifyToken, async (req, res) => {
  try {
    const { designation, departmentId, salary, status } = req.body;

    const result = await pool.query(`
      UPDATE employees 
      SET designation = COALESCE($1, designation),
          departmentId = COALESCE($2, departmentId),
          salary = COALESCE($3, salary),
          status = COALESCE($4, status),
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [designation, departmentId, salary, status, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
app.delete('/api/employees/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// ==================== ATTENDANCE ROUTES ====================

// Mark attendance
app.post('/api/attendance/checkin', verifyToken, async (req, res) => {
  try {
    const { employeeId, latitude, longitude, ipAddress } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const checkResult = await pool.query(
      'SELECT * FROM attendance WHERE employeeId = $1 AND attendanceDate = $2',
      [employeeId, today]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    const result = await pool.query(`
      INSERT INTO attendance (employeeId, attendanceDate, checkInTime, latitude, longitude, ipAddress, status)
      VALUES ($1, $2, CURRENT_TIME, $3, $4, $5, 'present')
      RETURNING *
    `, [employeeId, today, latitude, longitude, ipAddress]);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Check-in failed' });
  }
});

// Check out
app.post('/api/attendance/checkout', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const result = await pool.query(`
      UPDATE attendance 
      SET checkOutTime = CURRENT_TIME,
          totalHours = EXTRACT(EPOCH FROM (CURRENT_TIME - checkInTime)) / 3600
      WHERE employeeId = $1 AND attendanceDate = $2
      RETURNING *
    `, [employeeId, today]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No check-in found for today' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Check-out failed' });
  }
});

// Get attendance records
app.get('/api/attendance/:employeeId', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM attendance WHERE employeeId = $1';
    const params = [req.params.employeeId];

    if (startDate) {
      query += ` AND attendanceDate >= $${params.length + 1}`;
      params.push(startDate);
    }
    if (endDate) {
      query += ` AND attendanceDate <= $${params.length + 1}`;
      params.push(endDate);
    }

    query += ' ORDER BY attendanceDate DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// ==================== LEAVES ROUTES ====================

// Apply leave
app.post('/api/leaves', verifyToken, async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    
    const daysCount = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

    const result = await pool.query(`
      INSERT INTO leaves (employeeId, leaveType, startDate, endDate, totalDays, reason, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `, [employeeId, leaveType, startDate, endDate, daysCount, reason]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply leave' });
  }
});

// Get leaves
app.get('/api/leaves', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, e.employeeId, u.firstName, u.lastName
      FROM leaves l
      JOIN employees e ON l.employeeId = e.id
      JOIN users u ON e.userId = u.id
      ORDER BY l.createdAt DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

// Approve/Reject leave
app.put('/api/leaves/:id', verifyToken, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const result = await pool.query(`
      UPDATE leaves 
      SET status = $1, rejectionReason = $2, approvedBy = $3
      WHERE id = $4
      RETURNING *
    `, [status, rejectionReason || null, req.userId, req.params.id]);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leave' });
  }
});

// ==================== DEPARTMENTS ROUTES ====================

// Get departments
app.get('/api/departments', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Add department
app.post('/api/departments', verifyToken, async (req, res) => {
  try {
    const { name, description, headId } = req.body;

    const result = await pool.query(`
      INSERT INTO departments (name, description, headId)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [name, description, headId]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add department' });
  }
});

// ==================== ANALYTICS ROUTES ====================

// Get dashboard stats
app.get('/api/analytics/dashboard', verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM attendance WHERE attendanceDate = $1 AND status = 'present') as presentToday,
        (SELECT COUNT(*) FROM attendance WHERE attendanceDate = $1 AND status = 'absent') as absentToday,
        (SELECT COUNT(*) FROM attendance WHERE attendanceDate = $1 AND status = 'late') as lateToday,
        (SELECT COUNT(*) FROM leaves WHERE startDate <= $1 AND endDate >= $1 AND status = 'approved') as onLeaveToday,
        (SELECT COUNT(DISTINCT employeeId) FROM employees) as totalEmployees
    `, [today]);

    res.json({ success: true, data: stats.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'SA Attend Pro is running ✅', timestamp: new Date() });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 SA Attend Pro API Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}\n`);
});

module.exports = app;
