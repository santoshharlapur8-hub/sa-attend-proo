#!/bin/bash
# install.sh - Automated installation script for SA Attend Pro
# Run with: bash install.sh

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║    SA ATTEND PRO - AUTOMATED INSTALLATION SCRIPT           ║"
echo "║    Professional Attendance Management System v1.0.0       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[*]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check system requirements
print_status "Checking system requirements..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Install Node.js from https://nodejs.org/ (v18 or higher)"
    exit 1
fi
NODE_VERSION=$(node -v)
print_success "Node.js $NODE_VERSION found"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
NPM_VERSION=$(npm -v)
print_success "npm $NPM_VERSION found"

# Check PostgreSQL (optional)
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    print_success "PostgreSQL found: $PSQL_VERSION"
else
    print_warning "PostgreSQL not found - install manually or use Docker"
fi

echo ""
print_status "System requirements check complete"
echo ""

# Ask for installation method
echo "Choose installation method:"
echo "1) Local Development (Node.js + PostgreSQL on your machine)"
echo "2) Docker (Easiest - includes PostgreSQL, Redis, Nginx)"
echo ""
read -p "Enter your choice (1 or 2): " INSTALL_METHOD

case $INSTALL_METHOD in
    1)
        print_status "Installing for Local Development..."
        
        # Install dependencies
        print_status "Installing npm dependencies..."
        npm install
        print_success "Dependencies installed"
        
        # Create .env file
        if [ ! -f ".env.local" ]; then
            print_status "Creating .env.local file..."
            cp .env.example .env.local
            print_warning "Please edit .env.local with your database credentials"
            print_warning "Key settings:"
            print_warning "  - DATABASE_URL=postgresql://user:password@localhost:5432/attend_pro_db"
            print_warning "  - JWT_SECRET=<your_secret_key>"
        else
            print_success ".env.local already exists"
        fi
        
        # Initialize database
        print_status "Initializing database..."
        read -p "PostgreSQL database password: " DB_PASSWORD
        
        # Create database
        print_status "Creating PostgreSQL database..."
        createdb -U postgres attend_pro_db || echo "Database might already exist"
        
        # Initialize schema
        node scripts/initDB.js
        print_success "Database initialized"
        
        echo ""
        print_success "Local development setup complete!"
        echo ""
        echo "Next steps:"
        echo "1. Edit .env.local with your settings"
        echo "2. Run: npm run dev"
        echo "3. Open: http://localhost:3000"
        ;;
        
    2)
        print_status "Installing with Docker..."
        
        # Check Docker
        if ! command -v docker &> /dev/null; then
            print_error "Docker is not installed"
            echo "Install Docker from https://www.docker.com/"
            exit 1
        fi
        print_success "Docker found: $(docker --version)"
        
        # Check Docker Compose
        if ! command -v docker-compose &> /dev/null; then
            print_error "Docker Compose is not installed"
            echo "Install Docker Compose or use 'docker compose'"
            exit 1
        fi
        print_success "Docker Compose found: $(docker-compose --version)"
        
        # Create .env file
        if [ ! -f ".env.local" ]; then
            print_status "Creating .env.local file..."
            cp .env.example .env.local
            print_warning "Please review and edit .env.local if needed"
        fi
        
        # Start Docker containers
        print_status "Starting Docker containers..."
        docker-compose up -d
        print_success "Containers started"
        
        # Wait for services to be ready
        print_status "Waiting for services to be ready (this may take 1-2 minutes)..."
        sleep 10
        
        # Initialize database
        print_status "Initializing database..."
        docker-compose exec -T app node scripts/initDB.js
        print_success "Database initialized"
        
        echo ""
        print_success "Docker setup complete!"
        echo ""
        echo "Services running:"
        docker-compose ps
        echo ""
        echo "Next steps:"
        echo "1. Open: http://localhost"
        echo "2. View logs: docker-compose logs -f"
        echo "3. Stop: docker-compose down"
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  📚 DOCUMENTATION                                           ║"
echo "║                                                              ║"
echo "║  • Quick Start: QUICK_START_GUIDE.md                        ║"
echo "║  • Full Guide: SA_ATTEND_PRO_COMPLETE_GUIDE.md              ║"
echo "║  • Troubleshooting: See README.md                           ║"
echo "║                                                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

print_success "Installation complete! 🎉"
echo ""
echo "Happy Coding! 🚀"
