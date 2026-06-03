# SA ATTEND PRO - QUICK START GUIDE 🚀

## 📋 TABLE OF CONTENTS
1. System Requirements
2. Local Setup (5 minutes)
3. Docker Deployment (3 minutes)
4. Cloud Deployment Options
5. Testing the App
6. Troubleshooting
7. First Login

---

## ✅ SYSTEM REQUIREMENTS

### Minimum Requirements:
- **Node.js**: v18 or higher (Download: nodejs.org)
- **npm**: v9 or higher (comes with Node.js)
- **PostgreSQL**: v12+ OR MySQL 8+ (Database)
- **RAM**: 2GB minimum
- **Storage**: 1GB minimum
- **Internet**: Required for npm packages

### Optional (For Production):
- Docker & Docker Compose
- nginx (web server)
- SSL Certificate (Let's Encrypt)

---

## 🏃 LOCAL SETUP (WINDOWS/MAC/LINUX)

### Step 1: Install Prerequisites
```bash
# Check Node.js installation
node --version  # Should be v18+
npm --version   # Should be v9+

# If not installed, download from nodejs.org
```

### Step 2: Install PostgreSQL
**Windows**: Download installer from postgresql.org
**Mac**: `brew install postgresql`
**Linux**: `sudo apt-get install postgresql postgresql-contrib`

Start PostgreSQL service:
```bash
# Windows: Already running as service
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Step 3: Clone or Extract Project
```bash
# If you have Git
git clone https://github.com/yourusername/sa-attend-pro.git
cd sa-attend-pro

# OR download and extract ZIP file
cd sa-attend-pro
```

### Step 4: Install Dependencies
```bash
npm install
# This will download all required packages (~500MB)
```

### Step 5: Configure Environment
```bash
# Copy example config
cp .env.example .env.local

# Edit with your settings (use any text editor)
# Key settings to change:
# - DATABASE_URL=postgresql://postgres:password@localhost:5432/attend_pro_db
# - JWT_SECRET=your_random_secret_key
```

### Step 6: Create Database
```bash
# Create new PostgreSQL database
createdb -U postgres attend_pro_db

# Initialize tables
node scripts/initDB.js
# You should see: ✅ Database initialization completed successfully!
```

### Step 7: Start Application
```bash
npm run dev
# Output should show: 🚀 SA Attend Pro API Server is running on http://localhost:3000
```

### Step 8: Access Application
Open browser and go to: **http://localhost:3000**

**Demo Login:**
- Email: any@email.com
- Password: any password
- Role: Admin / Manager / Employee

---

## 🐳 DOCKER DEPLOYMENT (EASIEST FOR PRODUCTION)

### Prerequisites:
- Docker Desktop installed (docker.com)
- Docker Compose (included with Docker Desktop)

### Quick Start:
```bash
# 1. Navigate to project folder
cd sa-attend-pro

# 2. Copy environment file
cp .env.example .env.local

# 3. Start all services (Database, Redis, App, Nginx)
docker-compose up -d

# 4. Initialize database (one time only)
docker-compose exec app node scripts/initDB.js

# 5. Check if everything is running
docker-compose ps
# All services should show "Up"

# 6. View logs
docker-compose logs -f app

# 7. Access application
# Open: http://localhost
```

### Useful Docker Commands:
```bash
# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Execute command inside container
docker-compose exec app npm run migrate

# Remove everything (careful!)
docker-compose down -v
```

---

## ☁️ CLOUD DEPLOYMENT OPTIONS

### OPTION 1: Deploy on Vercel (Easiest for Frontend)
```bash
# 1. Sign up at vercel.com
# 2. Connect GitHub repository
# 3. Add environment variables in Vercel dashboard
# 4. Deploy with one click
# Features: Auto SSL, CI/CD, Global CDN
```

### OPTION 2: Deploy on AWS EC2
```bash
# 1. Launch EC2 instance (Ubuntu 20.04)
# 2. Connect via SSH
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install Docker
sudo apt-get update
sudo apt-get install docker.io docker-compose -y
sudo usermod -aG docker ubuntu

# 4. Clone repository
git clone https://github.com/yourusername/sa-attend-pro.git
cd sa-attend-pro

# 5. Update .env with your settings
nano .env.local

# 6. Deploy
docker-compose up -d

# 7. Setup SSL with Let's Encrypt (optional)
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone -d yourdomain.com
```

### OPTION 3: Deploy on DigitalOcean (Recommended for Startups)
```bash
# 1. Create Droplet ($5-15/month)
# 2. SSH into server
# 3. Install Docker: sudo apt-get install docker.io -y
# 4. Same as AWS steps above
# 5. Setup firewall and SSL
```

### OPTION 4: Deploy on Heroku
```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create sa-attend-pro

# 4. Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# 5. Deploy
git push heroku main

# 6. Initialize database
heroku run node scripts/initDB.js
```

### OPTION 5: Deploy on Railway.app (Simplest)
```bash
# 1. Visit railway.app
# 2. Click "New Project"
# 3. Select "Deploy from GitHub"
# 4. Connect repository
# 5. Add PostgreSQL service
# 6. Deploy automatically
# Cost: Pay-as-you-go, very cheap
```

---

## 🧪 TESTING THE APPLICATION

### 1. Health Check
```bash
curl http://localhost:3000/api/health
# Expected response: {"status":"SA Attend Pro is running ✅"}
```

### 2. Login Test
Use any email and password
```
Email: admin@company.com
Password: password123
Role: Admin
```

### 3. Create Employee
1. Go to Dashboard > Employees
2. Click "Add Employee"
3. Fill details and save
4. Check if appears in list

### 4. Mark Attendance
1. Go to Dashboard > Attendance
2. Mark present/absent for employee
3. Check if record saved

### 5. Create Leave Request
1. Go to Dashboard > Leaves
2. Click "Apply Leave"
3. Fill details
4. Check if appears in Pending

---

## 🐛 TROUBLESHOOTING

### Issue 1: Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
```bash
# Check if PostgreSQL is running
psql --version
pg_isready  # Should show: accepting connections

# If not running:
# Windows: Start PostgreSQL service from Services
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Issue 2: Port 3000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
```bash
# Kill process using port 3000
# Windows: netstat -ano | findstr :3000, then taskkill /PID [PID]
# Mac/Linux: lsof -ti:3000 | xargs kill -9
```

### Issue 3: npm install Fails
```
Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Database Already Exists
```
createdb: error: database "attend_pro_db" already exists
```
**Solution:**
```bash
# Drop existing database
dropdb attend_pro_db
# Recreate
createdb attend_pro_db
# Initialize
node scripts/initDB.js
```

### Issue 5: Docker Container Won't Start
```bash
# Check logs
docker-compose logs app

# Rebuild container
docker-compose build --no-cache
docker-compose up -d
```

---

## 🔐 FIRST LOGIN SETUP

### Admin Account Creation:
1. Register with your email
2. Set role as "Admin"
3. Login with credentials
4. Go to Settings > User Management
5. Create manager accounts
6. Create employee accounts

### Initial Configuration:
```
1. Company Settings:
   - Company name
   - Office hours
   - Holidays
   - Leave policies

2. Departments:
   - Create departments
   - Assign employees
   - Set department heads

3. Email Settings:
   - Configure SMTP
   - Test email sending

4. Backups:
   - Enable automatic backups
   - Set schedule (daily/weekly)
```

---

## 📊 DATABASE BACKUP

### Automatic Backup (Docker):
```bash
# Already configured in docker-compose.yml
# Backups run daily at 2 AM
```

### Manual Backup:
```bash
# PostgreSQL dump
pg_dump -U sa_user -h localhost attend_pro_db > backup.sql

# Restore from backup
psql -U sa_user -h localhost attend_pro_db < backup.sql
```

---

## 🚢 PRODUCTION CHECKLIST

Before launching to production:

- [ ] Change JWT_SECRET to strong random key
- [ ] Change database password
- [ ] Update SMTP credentials (real email service)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Setup daily backups
- [ ] Enable rate limiting
- [ ] Setup error tracking (Sentry)
- [ ] Configure CDN for static files
- [ ] Setup monitoring/alerts
- [ ] Create admin user account
- [ ] Test all core features
- [ ] Document your setup
- [ ] Create disaster recovery plan

---

## 📞 SUPPORT

**Documentation**: Check SA_ATTEND_PRO_COMPLETE_GUIDE.md
**Issues**: Check Troubleshooting section
**Community**: Join our support forum
**Email**: support@saattendpro.com

---

## 🎉 NEXT STEPS AFTER LAUNCH

1. **Customize Theme**: Update logo, colors, branding
2. **Add Users**: Import employees via CSV
3. **Configure Policies**: Set leave rules, holidays
4. **Setup Integrations**: Payroll, HR software
5. **Train Users**: Create user accounts, send credentials
6. **Monitor Usage**: Check dashboard, fix issues
7. **Get Feedback**: Improve based on user needs
8. **Scale**: Add more employees, features

---

**Happy Deploying! 🚀**

For updates and issues: github.com/yourusername/sa-attend-pro
