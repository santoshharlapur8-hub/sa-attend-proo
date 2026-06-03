// scripts/initDB.js - Database Initialization Script
// Run this to create all tables: node scripts/initDB.js

const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  try {
    await client.connect();
    console.log('📊 Connected to database, creating tables...\n');

    // 1. USERS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'employee',
        phone VARCHAR(20),
        avatar VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // 2. EMPLOYEES TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        userId INT REFERENCES users(id),
        employeeId VARCHAR(50) UNIQUE NOT NULL,
        departmentId INT,
        designation VARCHAR(100),
        joinDate DATE NOT NULL,
        salary DECIMAL(12, 2),
        reportingManager INT REFERENCES employees(id),
        status VARCHAR(50) DEFAULT 'active',
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        pincode VARCHAR(10),
        bankAccount VARCHAR(50),
        panNumber VARCHAR(10),
        aadharNumber VARCHAR(12),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Employees table created');

    // 3. DEPARTMENTS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        headId INT REFERENCES employees(id),
        budget DECIMAL(15, 2),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Departments table created');

    // 4. ATTENDANCE TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        employeeId INT REFERENCES employees(id),
        attendanceDate DATE NOT NULL,
        checkInTime TIME,
        checkOutTime TIME,
        totalHours DECIMAL(5, 2),
        status VARCHAR(50) DEFAULT 'present',
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        ipAddress VARCHAR(45),
        deviceInfo TEXT,
        notes TEXT,
        approvedBy INT REFERENCES users(id),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(employeeId, attendanceDate)
      );
    `);
    console.log('✅ Attendance table created');

    // 5. LEAVES TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS leaves (
        id SERIAL PRIMARY KEY,
        employeeId INT REFERENCES employees(id),
        leaveType VARCHAR(50) NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        totalDays INT NOT NULL,
        reason TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        approvedBy INT REFERENCES users(id),
        rejectionReason TEXT,
        attachmentUrl VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Leaves table created');

    // 6. LEAVE TYPES TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS leave_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        allowedDaysPerYear INT NOT NULL,
        description TEXT,
        isPaid BOOLEAN DEFAULT true,
        requiresAttachment BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Leave Types table created');

    // 7. HOLIDAYS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS holidays (
        id SERIAL PRIMARY KEY,
        holidayDate DATE UNIQUE NOT NULL,
        holidayName VARCHAR(100) NOT NULL,
        description TEXT,
        isOptional BOOLEAN DEFAULT false,
        appliedToAll BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Holidays table created');

    // 8. SHIFTS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS shifts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        startTime TIME NOT NULL,
        endTime TIME NOT NULL,
        breakDuration INT DEFAULT 60,
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Shifts table created');

    // 9. EMPLOYEE SHIFTS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS employee_shifts (
        id SERIAL PRIMARY KEY,
        employeeId INT REFERENCES employees(id),
        shiftId INT REFERENCES shifts(id),
        effectiveFrom DATE NOT NULL,
        effectiveTo DATE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Employee Shifts table created');

    // 10. NOTIFICATIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        userId INT REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        isRead BOOLEAN DEFAULT false,
        actionUrl VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Notifications table created');

    // 11. AUDIT LOGS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        userId INT REFERENCES users(id),
        action VARCHAR(255) NOT NULL,
        tableName VARCHAR(100),
        recordId INT,
        oldValues JSONB,
        newValues JSONB,
        ipAddress VARCHAR(45),
        userAgent TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Audit Logs table created');

    // 12. SETTINGS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        settingKey VARCHAR(100) UNIQUE NOT NULL,
        settingValue TEXT NOT NULL,
        dataType VARCHAR(50),
        description TEXT,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Settings table created');

    // 13. SUBSCRIPTIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        planName VARCHAR(100) NOT NULL,
        planPrice DECIMAL(10, 2) NOT NULL,
        maxEmployees INT,
        billingCycle VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Subscriptions table created');

    // 14. COMPANY SUBSCRIPTIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS company_subscriptions (
        id SERIAL PRIMARY KEY,
        companyName VARCHAR(255) NOT NULL,
        companyEmail VARCHAR(255) UNIQUE NOT NULL,
        planId INT REFERENCES subscriptions(id),
        currentEmployees INT DEFAULT 1,
        startDate DATE NOT NULL,
        renewalDate DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        paymentStatus VARCHAR(50) DEFAULT 'pending',
        orderId VARCHAR(100),
        totalAmount DECIMAL(15, 2),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Company Subscriptions table created');

    // 15. CREATE INDEXES FOR PERFORMANCE
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_attendance_employeeId ON attendance(employeeId);
      CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendanceDate);
      CREATE INDEX IF NOT EXISTS idx_leaves_employeeId ON leaves(employeeId);
      CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves(status);
      CREATE INDEX IF NOT EXISTS idx_notifications_userId ON notifications(userId);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_userId ON audit_logs(userId);
    `);
    console.log('✅ Indexes created');

    // 16. INSERT DEFAULT DATA
    await client.query(`
      INSERT INTO leave_types (name, allowedDaysPerYear, isPaid, requiresAttachment)
      VALUES 
        ('Annual Leave', 20, true, false),
        ('Sick Leave', 10, true, false),
        ('Personal Leave', 5, false, false),
        ('Casual Leave', 8, true, false),
        ('Maternity Leave', 90, true, true),
        ('Paternity Leave', 15, true, false),
        ('Bereavement Leave', 3, true, false)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Default leave types inserted');

    await client.query(`
      INSERT INTO shifts (name, startTime, endTime, breakDuration)
      VALUES 
        ('Morning Shift', '09:00', '17:30', 60),
        ('Afternoon Shift', '12:00', '20:30', 60),
        ('Night Shift', '20:00', '04:00', 60),
        ('Flexible', '08:00', '18:00', 60)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Default shifts inserted');

    await client.query(`
      INSERT INTO subscriptions (planName, planPrice, maxEmployees, billingCycle)
      VALUES 
        ('Starter', 2999, 50, 'monthly'),
        ('Professional', 6999, 250, 'monthly'),
        ('Enterprise', 15000, 999999, 'monthly')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Default subscription plans inserted');

    console.log('\n✨ Database initialization completed successfully!');
    console.log('📌 Next steps:');
    console.log('   1. Update .env.local with your database credentials');
    console.log('   2. Run: npm run dev');
    console.log('   3. Visit: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await client.end();
  }
};

createTables();
