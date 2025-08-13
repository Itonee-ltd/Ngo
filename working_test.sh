
#!/bin/bash

# API Test Script for NGO Grant Management System (Working Endpoints Only)
BASE_URL="http://localhost:5000/api/v1"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variables
USER_TOKEN=""
ADMIN_TOKEN=""
APPLICATION_ID=""
APPLICATION_NUMBER=""

echo -e "${YELLOW}Testing Working Endpoints Only...${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}1. Health Check${NC}"
curl -s -X GET "$BASE_URL/health" | jq '.'
echo -e "\n"

# Test 2: Register User
echo -e "${YELLOW}2. Register User${NC}"
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "testuser'$(date +%s)'@example.com",
    "password": "Password123!",
    "phoneNumber": "+1234567890",
    "address": "123 Test St, Test City"
  }')
echo "$USER_RESPONSE" | jq '.'
echo -e "\n"

# Extract email for login
USER_EMAIL=$(echo "$USER_RESPONSE" | jq -r '.data.user.email // empty')

# Test 3: Login User
if [ -n "$USER_EMAIL" ]; then
  echo -e "${YELLOW}3. Login User${NC}"
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$USER_EMAIL\",
      \"password\": \"Password123!\"
    }")
  echo "$LOGIN_RESPONSE" | jq '.'
  USER_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')
  echo -e "\n"
fi

# Test 4: Get Profile (if logged in)
if [ -n "$USER_TOKEN" ]; then
  echo -e "${YELLOW}4. Get User Profile${NC}"
  curl -s -X GET "$BASE_URL/auth/profile" \
    -H "Authorization: Bearer $USER_TOKEN" | jq '.'
  echo -e "\n"
  
  # Test 5: Create Application (Fixed)
  echo -e "${YELLOW}5. Create Application${NC}"
  APP_RESPONSE=$(curl -s -X POST "$BASE_URL/applications" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "applicationType": "SCHOOL_FEES",
      "title": "Test School Fees Application",
      "description": "Testing application creation",
      "academicInfo": {
        "schoolName": "Test School",
        "schoolAddress": "Test Address",
        "studentClass": "Grade 10",
        "academicYear": "2024-2025"
      },
      "financialInfo": {
        "requestedAmount": 25000,
        "currency": "NGN",
        "breakdown": [
          {
            "item": "Tuition",
            "amount": 20000,
            "description": "School fees"
          }
        ]
      },
      "guardianInfo": {
        "guardianName": "Test Guardian",
        "relationship": "Parent",
        "guardianPhone": "+1234567890"
      },
      "supportingDocuments": [],
      "priority": "MEDIUM"
    }')
  echo "$APP_RESPONSE" | jq '.'
  APPLICATION_ID=$(echo "$APP_RESPONSE" | jq -r '.data._id // empty')
  APPLICATION_NUMBER=$(echo "$APP_RESPONSE" | jq -r '.data.applicationNumber // empty')
  echo -e "\n"
  
  # Test 6: Get User Applications
  echo -e "${YELLOW}6. Get User Applications${NC}"
  curl -s -X GET "$BASE_URL/applications/my-applications" \
    -H "Authorization: Bearer $USER_TOKEN" | jq '.'
  echo -e "\n"
  
  if [ -n "$APPLICATION_ID" ]; then
    # Test 7: Get Application by ID
    echo -e "${YELLOW}7. Get Application by ID${NC}"
    curl -s -X GET "$BASE_URL/applications/$APPLICATION_ID" \
      -H "Authorization: Bearer $USER_TOKEN" | jq '.'
    echo -e "\n"
    
    if [ -n "$APPLICATION_NUMBER" ]; then
      # Test 8: Get Application by Number
      echo -e "${YELLOW}8. Get Application by Number${NC}"
      curl -s -X GET "$BASE_URL/applications/number/$APPLICATION_NUMBER" \
        -H "Authorization: Bearer $USER_TOKEN" | jq '.'
      echo -e "\n"
    fi
    
    # Test 9: Update Application
    echo -e "${YELLOW}9. Update Application${NC}"
    curl -s -X PUT "$BASE_URL/applications/$APPLICATION_ID" \
      -H "Authorization: Bearer $USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Updated Test Application",
        "description": "Updated description"
      }' | jq '.'
    echo -e "\n"
    
    # Test 10: Cancel Application
    echo -e "${YELLOW}10. Cancel Application${NC}"
    curl -s -X PATCH "$BASE_URL/applications/$APPLICATION_ID/cancel" \
      -H "Authorization: Bearer $USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "reason": "Test cancellation"
      }' | jq '.'
    echo -e "\n"
  fi
  
  # Test 11: Update Profile
  echo -e "${YELLOW}11. Update Profile${NC}"
  curl -s -X PUT "$BASE_URL/auth/profile" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "firstName": "Updated",
      "lastName": "Name",
      "phoneNumber": "+0987654321"
    }' | jq '.'
  echo -e "\n"
  
  # Test 12: Change Password
  echo -e "${YELLOW}12. Change Password${NC}"
  curl -s -X POST "$BASE_URL/auth/change-password" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "currentPassword": "Password123!",
      "newPassword": "NewPassword123!",
      "confirmPassword": "NewPassword123!"
    }' | jq '.'
  echo -e "\n"
  
fi

echo -e "${GREEN}Core functionality tests completed!${NC}"
echo -e "${YELLOW}Skipped tests requiring AWS configuration:${NC}"
echo "- Email verification"
echo "- Password reset" 
echo "- Admin setup (requires proper email service)"
echo -e "\n${YELLOW}To test admin endpoints, manually create an admin user in your database.${NC}"