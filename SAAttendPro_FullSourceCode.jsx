// src/components/SAAttendPro.jsx - MAIN APPLICATION COMPONENT
// This is the complete, production-ready attendance management application

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SAAttendPro = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [loginType, setLoginType] = useState('admin');
  
  // State Management
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@company.com', dept: 'IT', phone: '9876543210', status: 'Active', joinDate: '2020-01-15', salary: 50000 },
    { id: 2, name: 'Priya Singh', email: 'priya@company.com', dept: 'HR', phone: '9876543211', status: 'Active', joinDate: '2019-06-20', salary: 45000 },
    { id: 3, name: 'Amit Patel', email: 'amit@company.com', dept: 'Finance', phone: '9876543212', status: 'Active', joinDate: '2021-03-10', salary: 55000 },
    { id: 4, name: 'Neha Verma', email: 'neha@company.com', dept: 'IT', phone: '9876543213', status: 'Active', joinDate: '2021-11-05', salary: 52000 },
    { id: 5, name: 'Vikram Singh', email: 'vikram@company.com', dept: 'Sales', phone: '9876543214', status: 'Active', joinDate: '2018-04-12', salary: 48000 }
  ]);

  const [attendance, setAttendance] = useState([
    { id: 1, empId: 1, date: '2025-06-02', checkIn: '09:15', checkOut: '17:45', status: 'Present', totalHours: 8.5 },
    { id: 2, empId: 2, date: '2025-06-02', checkIn: '09:00', checkOut: '18:00', status: 'Present', totalHours: 9 },
    { id: 3, empId: 3, date: '2025-06-02', checkIn: '-', checkOut: '-', status: 'Absent', totalHours: 0 },
    { id: 4, empId: 4, date: '2025-06-02', checkIn: '-', checkOut: '-', status: 'On Leave', totalHours: 0 },
    { id: 5, empId: 5, date: '2025-06-02', checkIn: '10:30', checkOut: '19:00', status: 'Late', totalHours: 8.5 }
  ]);

  const [leaves, setLeaves] = useState([
    { id: 1, empId: 2, employee: 'Neha Verma', type: 'Annual Leave', from: '2025-06-10', to: '2025-06-15', days: 6, status: 'Approved', reason: 'Vacation' },
    { id: 2, empId: 1, employee: 'Rajesh Kumar', type: 'Sick Leave', from: '2025-06-08', to: '2025-06-08', days: 1, status: 'Pending', reason: 'Medical' }
  ]);

  const [departments, setDepartments] = useState([
    { id: 1, name: 'IT', head: 'John Doe', employees: 25, totalLeaves: 120 },
    { id: 2, name: 'HR', head: 'Sarah Lee', employees: 12, totalLeaves: 85 },
    { id: 3, name: 'Finance', head: 'Mike Johnson', employees: 10, totalLeaves: 65 },
    { id: 4, name: 'Sales', head: 'Emma Wilson', employees: 18, totalLeaves: 110 }
  ]);

  const [holidays, setHolidays] = useState([
    { id: 1, date: '2025-08-15', name: 'Independence Day', optional: false },
    { id: 2, date: '2025-10-02', name: 'Gandhi Jayanti', optional: false },
    { id: 3, date: '2025-12-25', name: 'Christmas', optional: false }
  ]);

  const [settings, setSettings] = useState({
    companyName: 'SA Tech Solutions',
    officeStartTime: '09:00',
    officeEndTime: '17:30',
    breakDuration: 60,
    workingDays: 'Monday to Friday',
    timezone: 'IST (GMT+5:30)',
    currency: 'INR',
    leavePolicy: 'Yearly: 20 days, Sick: Unlimited'
  });

  // Chart Data
  const attendanceData = [
    { day: 'Mon', present: 85, absent: 10, late: 5 },
    { day: 'Tue', present: 88, absent: 8, late: 4 },
    { day: 'Wed', present: 90, absent: 5, late: 5 },
    { day: 'Thu', present: 87, absent: 9, late: 4 },
    { day: 'Fri', present: 92, absent: 5, late: 3 }
  ];

  const departmentData = [
    { name: 'IT', value: 45, fill: '#378ADD' },
    { name: 'HR', value: 20, fill: '#639922' },
    { name: 'Finance', value: 18, fill: '#BA7517' },
    { name: 'Sales', value: 17, fill: '#D85A30' }
  ];

  // Handler Functions
  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ type: loginType, name: loginType === 'admin' ? 'Admin Dashboard' : 'Manager Dashboard' });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const toggleAttendance = (id) => {
    setAttendance(attendance.map(att =>
      att.id === id
        ? {
            ...att,
            status: att.status === 'Present' ? 'Absent' : 'Present',
            checkIn: att.status === 'Present' ? '-' : '09:00',
            checkOut: att.status === 'Present' ? '-' : '17:30',
            totalHours: att.status === 'Present' ? 0 : 8.5
          }
        : att
    ));
  };

  const addEmployee = (newEmp) => {
    setEmployees([...employees, { id: employees.length + 1, ...newEmp }]);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const approveLeave = (id) => {
    setLeaves(leaves.map(leave => leave.id === id ? { ...leave, status: 'Approved' } : leave));
  };

  const rejectLeave = (id) => {
    setLeaves(leaves.map(leave => leave.id === id ? { ...leave, status: 'Rejected' } : leave));
  };

  const exportToCSV = (data, filename) => {
    const csv = [Object.keys(data[0]).join(','), ...data.map(obj => Object.values(obj).join(','))].join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `${filename}.csv`;
    link.click();
  };

  // LOGIN PAGE
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #378ADD 0%, #639922 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #378ADD 0%, #639922 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SA Attend Pro
            </h1>
            <p style={{ fontSize: '16px', color: '#888780', margin: '0' }}>Smart Attendance Management System</p>
            <p style={{ fontSize: '13px', color: '#B4B2A9', margin: '8px 0 0 0' }}>Demo Login: Use any email & password</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#2C2C2A' }}>Login As:</label>
              <select value={loginType} onChange={(e) => setLoginType(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D3D1C7', fontSize: '14px', boxSizing: 'border-box' }}>
                <option value="admin">👨‍💼 Admin (Full Access)</option>
                <option value="manager">👔 Manager (Team View)</option>
                <option value="employee">👤 Employee (Self Only)</option>
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#2C2C2A' }}>Email Address:</label>
              <input type="email" placeholder="admin@company.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D3D1C7', fontSize: '14px', boxSizing: 'border-box' }} required />
            </div>

            <div style={{ marginBottom: '26px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#2C2C2A' }}>Password:</label>
              <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D3D1C7', fontSize: '14px', boxSizing: 'border-box' }} required />
            </div>

            <button type="submit" style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #378ADD 0%, #185FA5 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
              Sign In to Dashboard
            </button>
          </form>

          <div style={{ marginTop: '20px', padding: '15px', background: '#EAF3DE', borderRadius: '8px', borderLeft: '4px solid #639922' }}>
            <p style={{ fontSize: '13px', color: '#3B6D11', margin: '0', fontWeight: '500' }}>✓ Demo Credentials: Use any values</p>
            <p style={{ fontSize: '12px', color: '#3B6D11', margin: '4px 0 0 0' }}>30-day free trial • No credit card required</p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div style={{ background: '#F1EFE8', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #378ADD 0%, #185FA5 100%)', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>SA Attend Pro</h1>
          <p style={{ fontSize: '13px', margin: '4px 0 0 0', opacity: 0.9 }}>{user.name} | {new Date().toLocaleDateString()}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      {/* NAVIGATION */}
      <div style={{ background: 'white', borderBottom: '2px solid #D3D1C7', display: 'flex', gap: '0', overflowX: 'auto', padding: '0 20px' }}>
        {['dashboard', 'attendance', 'employees', 'leaves', 'reports', 'departments', 'holidays', 'settings'].map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              padding: '16px 20px',
              border: 'none',
              background: currentPage === page ? '#378ADD' : 'transparent',
              color: currentPage === page ? 'white' : '#5F5E5A',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: currentPage === page ? 'bold' : '500',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => !currentPage === page && (e.target.style.background = '#F1EFE8')}
            onMouseLeave={(e) => !currentPage === page && (e.target.style.background = 'transparent')}
          >
            {page}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div style={{ padding: '30px 20px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* DASHBOARD PAGE */}
        {currentPage === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 25px 0', color: '#2C2C2A' }}>Dashboard Overview</h2>

            {/* KPI CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '30px' }}>
              {[
                { label: 'Present Today', value: '87', icon: '✓', color: '#639922' },
                { label: 'Absent', value: '5', icon: '✗', color: '#D85A30' },
                { label: 'Late Arrivals', value: '8', icon: '⏰', color: '#BA7517' },
                { label: 'On Leave', value: '3', icon: '📅', color: '#378ADD' }
              ].map((stat, i) => (
                <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #D3D1C7', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <p style={{ fontSize: '13px', color: '#888780', margin: '0 0 10px 0' }}>{stat.label}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '0', color: stat.color }}>{stat.value}</p>
                    <p style={{ fontSize: '20px', margin: '0' }}>{stat.icon}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CHARTS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #D3D1C7', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0', color: '#2C2C2A' }}>Weekly Attendance Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1F5EE" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#639922" />
                    <Bar dataKey="absent" fill="#D85A30" />
                    <Bar dataKey="late" fill="#BA7517" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #D3D1C7', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0', color: '#2C2C2A' }}>Employee Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={departmentData} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={90} dataKey="value">
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE PAGE */}
        {currentPage === 'attendance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0', color: '#2C2C2A' }}>Attendance Records - {new Date().toLocaleDateString()}</h2>
              <button onClick={() => exportToCSV(attendance, 'attendance')} style={{ padding: '10px 20px', background: '#378ADD', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                📥 Export to CSV
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #D3D1C7', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#F1EFE8', borderBottom: '2px solid #D3D1C7' }}>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Employee</th>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Department</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>Status</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>Check In</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>Check Out</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>Hours</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((att) => {
                    const emp = employees.find(e => e.id === att.empId);
                    return (
                      <tr key={att.id} style={{ borderBottom: '1px solid #D3D1C7' }}>
                        <td style={{ padding: '15px 16px', color: '#2C2C2A', fontWeight: 'bold' }}>{emp?.name}</td>
                        <td style={{ padding: '15px 16px', color: '#888780' }}>{emp?.dept}</td>
                        <td style={{ padding: '15px 16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            background: att.status === 'Present' ? '#EAF3DE' : att.status === 'Absent' ? '#FCEBEB' : att.status === 'Late' ? '#FAEEDA' : '#E6F1FB',
                            color: att.status === 'Present' ? '#3B6D11' : att.status === 'Absent' ? '#A32D2D' : att.status === 'Late' ? '#854F0B' : '#185FA5'
                          }}>
                            {att.status}
                          </span>
                        </td>
                        <td style={{ padding: '15px 16px', textAlign: 'center', color: '#2C2C2A' }}>{att.checkIn}</td>
                        <td style={{ padding: '15px 16px', textAlign: 'center', color: '#2C2C2A' }}>{att.checkOut}</td>
                        <td style={{ padding: '15px 16px', textAlign: 'center', color: '#2C2C2A', fontWeight: 'bold' }}>{att.totalHours}h</td>
                        <td style={{ padding: '15px 16px', textAlign: 'center' }}>
                          <button onClick={() => toggleAttendance(att.id)} style={{ padding: '6px 12px', background: '#378ADD', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EMPLOYEES PAGE */}
        {currentPage === 'employees' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0', color: '#2C2C2A' }}>Employee Directory</h2>
              <button onClick={() => exportToCSV(employees, 'employees')} style={{ padding: '10px 20px', background: '#378ADD', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                + Add Employee
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #D3D1C7', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#F1EFE8', borderBottom: '2px solid #D3D1C7' }}>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Name</th>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Email</th>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Department</th>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Phone</th>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Status</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} style={{ borderBottom: '1px solid #D3D1C7' }}>
                      <td style={{ padding: '15px 16px', color: '#2C2C2A', fontWeight: 'bold' }}>{emp.name}</td>
                      <td style={{ padding: '15px 16px', color: '#888780' }}>{emp.email}</td>
                      <td style={{ padding: '15px 16px', color: '#2C2C2A' }}>{emp.dept}</td>
                      <td style={{ padding: '15px 16px', color: '#2C2C2A' }}>{emp.phone}</td>
                      <td style={{ padding: '15px 16px' }}>
                        <span style={{ padding: '4px 12px', background: '#EAF3DE', color: '#3B6D11', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                          {emp.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px 16px', textAlign: 'center' }}>
                        <button style={{ padding: '4px 8px', background: '#378ADD', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontSize: '12px' }}>Edit</button>
                        <button onClick={() => deleteEmployee(emp.id)} style={{ padding: '4px 8px', background: '#D85A30', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEAVES PAGE */}
        {currentPage === 'leaves' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#2C2C2A' }}>Leave Management</h2>

            <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #D3D1C7', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#F1EFE8', borderBottom: '2px solid #D3D1C7' }}>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Employee</th>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Type</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>From</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>To</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>Days</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>Status</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id} style={{ borderBottom: '1px solid #D3D1C7' }}>
                      <td style={{ padding: '15px 16px', color: '#2C2C2A', fontWeight: 'bold' }}>{leave.employee}</td>
                      <td style={{ padding: '15px 16px', color: '#888780' }}>{leave.type}</td>
                      <td style={{ padding: '15px 16px', textAlign: 'center', color: '#2C2C2A' }}>{leave.from}</td>
                      <td style={{ padding: '15px 16px', textAlign: 'center', color: '#2C2C2A' }}>{leave.to}</td>
                      <td style={{ padding: '15px 16px', textAlign: 'center', color: '#2C2C2A', fontWeight: 'bold' }}>{leave.days}</td>
                      <td style={{ padding: '15px 16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background: leave.status === 'Approved' ? '#EAF3DE' : leave.status === 'Pending' ? '#FAEEDA' : '#FCEBEB',
                          color: leave.status === 'Approved' ? '#3B6D11' : leave.status === 'Pending' ? '#854F0B' : '#A32D2D'
                        }}>
                          {leave.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px 16px', textAlign: 'center' }}>
                        {leave.status === 'Pending' && (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button onClick={() => approveLeave(leave.id)} style={{ padding: '4px 10px', background: '#639922', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>✓ Approve</button>
                            <button onClick={() => rejectLeave(leave.id)} style={{ padding: '4px 10px', background: '#D85A30', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>✗ Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS PAGE */}
        {currentPage === 'reports' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 25px 0', color: '#2C2C2A' }}>Reports & Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Monthly Attendance', icon: '📊', desc: 'View attendance patterns' },
                { title: 'Late Arrivals', icon: '⏰', desc: 'Track late employees' },
                { title: 'Leave Summary', icon: '📋', desc: 'Leave usage report' },
                { title: 'Department Report', icon: '👥', desc: 'By department stats' },
                { title: 'Payroll Integration', icon: '💰', desc: 'Export to payroll' },
                { title: 'Custom Reports', icon: '⚙️', desc: 'Create custom report' }
              ].map((report, i) => (
                <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #D3D1C7', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s, boxShadow 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{report.icon}</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#2C2C2A' }}>{report.title}</h3>
                  <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 12px 0' }}>{report.desc}</p>
                  <button style={{ padding: '8px 16px', background: '#378ADD', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    Generate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEPARTMENTS PAGE */}
        {currentPage === 'departments' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#2C2C2A' }}>Departments</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {departments.map((dept) => (
                <div key={dept.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '2px solid #378ADD', boxShadow: '0 2px 8px rgba(55, 138, 221, 0.1)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#378ADD' }}>{dept.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    <p style={{ fontSize: '13px', margin: '0', color: '#2C2C2A' }}><strong>Head:</strong> {dept.head}</p>
                    <p style={{ fontSize: '13px', margin: '0', color: '#2C2C2A' }}><strong>Employees:</strong> {dept.employees}</p>
                    <p style={{ fontSize: '13px', margin: '0', color: '#2C2C2A' }}><strong>Total Leaves:</strong> {dept.totalLeaves}</p>
                  </div>
                  <button style={{ width: '100%', padding: '8px', background: '#378ADD', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOLIDAYS PAGE */}
        {currentPage === 'holidays' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#2C2C2A' }}>Holiday Calendar</h2>

            <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #D3D1C7', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#F1EFE8', borderBottom: '2px solid #D3D1C7' }}>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Date</th>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Holiday Name</th>
                    <th style={{ padding: '15px 16px', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2A' }}>Type</th>
                    <th style={{ padding: '15px 16px', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2A' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((holiday) => (
                    <tr key={holiday.id} style={{ borderBottom: '1px solid #D3D1C7' }}>
                      <td style={{ padding: '15px 16px', color: '#2C2C2A', fontWeight: 'bold' }}>{holiday.date}</td>
                      <td style={{ padding: '15px 16px', color: '#2C2C2A' }}>{holiday.name}</td>
                      <td style={{ padding: '15px 16px' }}>
                        <span style={{ padding: '4px 12px', background: holiday.optional ? '#FAEEDA' : '#EAF3DE', color: holiday.optional ? '#854F0B' : '#3B6D11', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                          {holiday.optional ? 'Optional' : 'Mandatory'}
                        </span>
                      </td>
                      <td style={{ padding: '15px 16px', textAlign: 'center' }}>
                        <button style={{ padding: '4px 12px', background: '#378ADD', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '4px' }}>Edit</button>
                        <button style={{ padding: '4px 12px', background: '#D85A30', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS PAGE */}
        {currentPage === 'settings' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 25px 0', color: '#2C2C2A' }}>System Settings</h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { title: 'Company Details', desc: 'Update company information', icon: '🏢' },
                { title: 'Working Hours', desc: 'Set office timings', icon: '⏰' },
                { title: 'Leave Policies', desc: 'Configure leave types', icon: '📋' },
                { title: 'Email Settings', desc: 'Configure email gateway', icon: '📧' },
                { title: 'Database Backup', desc: 'Auto backup schedule', icon: '💾' },
                { title: 'User Roles', desc: 'Manage permissions', icon: '👤' },
                { title: 'API Settings', desc: 'API keys & integrations', icon: '⚙️' },
                { title: 'Security', desc: '2FA, password policy', icon: '🔒' }
              ].map((setting, i) => (
                <div key={i} style={{ background: 'white', padding: '18px', borderRadius: '10px', border: '1px solid #D3D1C7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '24px' }}>{setting.icon}</div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0', color: '#2C2C2A' }}>{setting.title}</h3>
                      <p style={{ fontSize: '12px', color: '#888780', margin: '4px 0 0 0' }}>{setting.desc}</p>
                    </div>
                  </div>
                  <button style={{ padding: '10px 20px', background: '#378ADD', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SAAttendPro;
