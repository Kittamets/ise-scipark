#!/bin/bash

# SciPark Quick Deployment Script (Linux/Mac)
# This script helps automate the deployment process

echo "🚀 SciPark Deployment Helper"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to generate JWT secret
generate_jwt_secret() {
    echo -e "${YELLOW}🔐 Generating JWT Secret...${NC}"
    SECRET=$(openssl rand -hex 64)
    echo -e "${GREEN}✅ JWT Secret generated!${NC}"
    echo -e "${NC}Secret: $SECRET${NC}"
    echo ""
    echo "$SECRET"
}

# Function to check if backend is running
test_backend_health() {
    local url=$1
    echo -e "${YELLOW}🔍 Testing backend at $url...${NC}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url/health")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
        curl -s "$url/health" | jq '.'
        return 0
    else
        echo -e "${RED}❌ Backend is not responding (HTTP $response)${NC}"
        return 1
    fi
}

# Main menu
show_menu() {
    echo -e "${CYAN}Please select an option:${NC}"
    echo "1. Generate JWT Secret"
    echo "2. Test Local Backend"
    echo "3. Test Production Backend"
    echo "4. Build Frontend"
    echo "5. Create Production Environment File"
    echo "6. Run Database Seed"
    echo "7. Test All APIs"
    echo "8. Open Deployment Guide"
    echo "9. Exit"
    echo ""
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice (1-9): " choice
    echo ""

    case $choice in
        1)
            JWT_SECRET=$(generate_jwt_secret)
            echo -e "${YELLOW}💾 Save this secret for your backend environment variables!${NC}"
            read -p "Press Enter to continue..."
            ;;
        2)
            test_backend_health "http://localhost:3000"
            if [ $? -ne 0 ]; then
                echo -e "${CYAN}💡 Start backend with: cd backend && node index.js${NC}"
            fi
            read -p "Press Enter to continue..."
            ;;
        3)
            read -p "Enter your production backend URL: " prod_url
            test_backend_health "$prod_url"
            read -p "Press Enter to continue..."
            ;;
        4)
            echo -e "${YELLOW}🏗️ Building frontend...${NC}"
            cd frontend
            npm run build
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Frontend build successful!${NC}"
                echo -e "${NC}📦 Build output in frontend/dist${NC}"
            else
                echo -e "${RED}❌ Frontend build failed!${NC}"
            fi
            cd ..
            read -p "Press Enter to continue..."
            ;;
        5)
            echo -e "${YELLOW}📝 Creating production environment template...${NC}"
            JWT_SECRET=$(openssl rand -hex 64)
            
            cat > PRODUCTION_ENV_TEMPLATE.txt << EOF
# Backend Environment Variables (Railway)
MONGO_URI=mongodb+srv://scipark_admin:YOUR_PASSWORD@scipark-production.xxxxx.mongodb.net/scipark_production?retryWrites=true&w=majority
JWT_SECRET=$JWT_SECRET
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=YOUR_BREVO_USER
EMAIL_PASS=YOUR_BREVO_API_KEY
EMAIL_FROM=noreply@scipark.com
PORT=3000
NODE_ENV=production
CLIENT_URL=https://scipark-app.vercel.app

# Frontend Environment Variables (Vercel)
VITE_API_URL=https://scipark-backend.railway.app/api
EOF
            echo -e "${GREEN}✅ Template created: PRODUCTION_ENV_TEMPLATE.txt${NC}"
            echo -e "${YELLOW}📝 Edit this file with your actual values${NC}"
            read -p "Press Enter to continue..."
            ;;
        6)
            echo -e "${YELLOW}🌱 Running database seed...${NC}"
            read -p "⚠️ This will clear existing data! Continue? (y/n): " confirm
            if [ "$confirm" = "y" ]; then
                cd backend
                node scripts/seed.js
                cd ..
                echo -e "${GREEN}✅ Seed completed!${NC}"
            else
                echo -e "${RED}❌ Seed cancelled${NC}"
            fi
            read -p "Press Enter to continue..."
            ;;
        7)
            echo -e "${YELLOW}🧪 Testing APIs...${NC}"
            read -p "Enter API URL (e.g., http://localhost:3000): " api_url
            
            echo -e "\n${CYAN}1. Testing health endpoint...${NC}"
            curl -s "$api_url/health" | jq '.'

            echo -e "\n${CYAN}2. Testing parking zones...${NC}"
            curl -s "$api_url/api/parking/zones" | jq '.data | length'

            echo -e "\n${CYAN}3. Testing parking spots...${NC}"
            curl -s "$api_url/api/parking/spots" | jq '.data | length'

            read -p "Press Enter to continue..."
            ;;
        8)
            echo -e "${YELLOW}📖 Opening deployment guide...${NC}"
            if [ -f "PRODUCTION_SETUP.md" ]; then
                if command -v xdg-open &> /dev/null; then
                    xdg-open PRODUCTION_SETUP.md
                elif command -v open &> /dev/null; then
                    open PRODUCTION_SETUP.md
                else
                    cat PRODUCTION_SETUP.md
                fi
            else
                echo -e "${RED}❌ PRODUCTION_SETUP.md not found!${NC}"
            fi
            read -p "Press Enter to continue..."
            ;;
        9)
            echo -e "${CYAN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid choice! Please select 1-9${NC}"
            read -p "Press Enter to continue..."
            ;;
    esac
    echo ""
done
