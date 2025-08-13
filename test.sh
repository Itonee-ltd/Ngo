#!/bin/bash

# API Test Script for NGO Grant Management System
# Usage: ./test.sh
# Make sure your server is running on port 5000

BASE_URL="http://localhost:5000/api/v1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables to store tokens
USER_TOKEN=""
ADMIN_TOKEN=""
APPLICATION_ID=""
APPLICATION_NUMBER=""

echo -e "${YELLOW}Starting API Tests...${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Health Check${NC}"
curl -s -X GET "$BASE_URL/health" | jq '.'
echo -e "\n"

# Test 2: Register User
echo -e "${YELLOW}2. Registering User${NC}"
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "Password123!",
    "phoneNumber": "+1234567890",
    "address": "123 Main St, City, State"
  }')
echo "$USER_RESPONSE" | jq '.'
echo -e "\n"

# Test 3: Login User
echo -e "${YELLOW}3. Logging in User${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Password123!"
  }')
echo "$LOGIN_RESPONSE" | jq '.'
USER_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')
echo -e "\n"

# Test 4: Setup Admin (if needed)
echo -e "${YELLOW}4. Setting up Admin${NC}"
ADMIN_SETUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/setup-admin" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "password": "AdminPass123!",
    "phoneNumber": "+0987654321"
  }')
echo "$ADMIN_SETUP_RESPONSE" | jq '.'
echo -e "\n"

# Test 5: Admin Login
echo -e "${YELLOW}5. Admin Login${NC}"
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123!"
  }')
echo "$ADMIN_LOGIN_RESPONSE" | jq '.'
ADMIN_TOKEN=$(echo "$ADMIN_LOGIN_RESPONSE" | jq -r '.data.token // empty')
echo -e "\n"

# Only proceed if user token exists
if [ -n "$USER_TOKEN" ]; then
  echo -e "${GREEN}User token obtained: ${USER_TOKEN:0:20}...${NC}\n"
  
  # Test 6: Get User Profile
  echo -e "${YELLOW}6. Getting User Profile${NC}"
  curl -s -X GET "$BASE_URL/auth/profile" \
    -H "Authorization: Bearer $USER_TOKEN" | jq '.'
  echo -e "\n"
  
  # Test 7: Create School Fees Application
  echo -e "${YELLOW}7. Creating School Fees Application${NC}"
  APP_RESPONSE=$(curl -s -X POST "$BASE_URL/applications" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "applicationType": "SCHOOL_FEES",
      "title": "School Fees Assistance Request",
      "description": "Need financial assistance for school fees",
      "urgencyReason": "Payment deadline approaching",
      "academicInfo": {
        "schoolName": "Test High School",
        "schoolAddress": "123 Education St",
        "studentClass": "Grade 12",
        "academicYear": "2024-2025",
        "principalName": "Dr. Smith",
        "schoolPhoneNumber": "+1234567890",
        "schoolEmail": "info@testhighschool.edu"
      },
      "financialInfo": {
        "requestedAmount": 50000,
        "currency": "NGN",
        "breakdown": [
          {
            "item": "Tuition Fees",
            "amount": 40000,
            "description": "Annual tuition"
          },
          {
            "item": "Books",
            "amount": 10000,
            "description": "Textbooks and materials"
          }
        ],
        "totalFamilyIncome": 100000,
        "numberOfDependents": 3
      },
      "guardianInfo": {
        "guardianName": "Jane Doe",
        "relationship": "Mother",
        "guardianPhone": "+1234567891",
        "guardianEmail": "jane.doe@example.com",
        "guardianAddress": "123 Main St",
        "occupation": "Teacher",
        "monthlyIncome": 30000
      },
      "supportingDocuments": [
        {
          "documentType": "School Letter",
          "documentUrl": "https://example.com/letter.pdf",
          "documentName": "admission_letter.pdf"
        }
      ],
      "priority": "MEDIUM"
    }')
  echo "$APP_RESPONSE" | jq '.'
  APPLICATION_ID=$(echo "$APP_RESPONSE" | jq -r '.data._id // empty')
  APPLICATION_NUMBER=$(echo "$APP_RESPONSE" | jq -r '.data.applicationNumber // empty')
  echo -e "\n"
  
  # Test 8: Get User Applications
  echo -e "${YELLOW}8. Getting User Applications${NC}"
  curl -s -X GET "$BASE_URL/applications/my-applications" \
    -H "Authorization: Bearer $USER_TOKEN" | jq '.'
  echo -e "\n"
  
  if [ -n "$APPLICATION_ID" ]; then
    echo -e "${GREEN}Application created with ID: $APPLICATION_ID${NC}\n"
    
    # Test 9: Get Application by ID
    echo -e "${YELLOW}9. Getting Application by ID${NC}"
    curl -s -X GET "$BASE_URL/applications/$APPLICATION_ID" \
      -H "Authorization: Bearer $USER_TOKEN" | jq '.'
    echo -e "\n"
    
    if [ -n "$APPLICATION_NUMBER" ]; then
      # Test 10: Get Application by Number
      echo -e "${YELLOW}10. Getting Application by Number${NC}"
      curl -s -X GET "$BASE_URL/applications/number/$APPLICATION_NUMBER" \
        -H "Authorization: Bearer $USER_TOKEN" | jq '.'
      echo -e "\n"
    fi
    
    # Test 11: Update Application
    echo -e "${YELLOW}11. Updating Application${NC}"
    curl -s -X PUT "$BASE_URL/applications/$APPLICATION_ID" \
      -H "Authorization: Bearer $USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Updated School Fees Assistance Request",
        "description": "Updated description with more details"
      }' | jq '.'
    echo -e "\n"
  fi
  
else
  echo -e "${RED}No user token - skipping user-protected routes${NC}\n"
fi

# Admin-only tests
if [ -n "$ADMIN_TOKEN" ]; then
  echo -e "${GREEN}Admin token obtained: ${ADMIN_TOKEN:0:20}...${NC}\n"
  
  # Test 12: Get All Applications (Admin)
  echo -e "${YELLOW}12. Getting All Applications (Admin)${NC}"
  curl -s -X GET "$BASE_URL/applications/admin/all" \
    -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
  echo -e "\n"
  
  # Test 13: Get Application Stats (Admin)
  echo -e "${YELLOW}13. Getting Application Stats (Admin)${NC}"
  curl -s -X GET "$BASE_URL/applications/admin/stats" \
    -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
  echo -e "\n"
  
  # Test 14: Get Pending Applications (Admin)
  echo -e "${YELLOW}14. Getting Pending Applications (Admin)${NC}"
  curl -s -X GET "$BASE_URL/applications/admin/pending" \
    -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
  echo -e "\n"
  
  if [ -n "$APPLICATION_ID" ]; then
    # Test 15: Review Application (Admin)
    echo -e "${YELLOW}15. Reviewing Application (Admin)${NC}"
    curl -s -X POST "$BASE_URL/applications/$APPLICATION_ID/review" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "status": "UNDER_REVIEW",
        "comments": "Application is under review",
        "internalNotes": "Looks promising",
        "followUpRequired": false
      }' | jq '.'
    echo -e "\n"
    
    # Test 16: Assign Application (Admin)
    echo -e "${YELLOW}16. Assigning Application (Admin)${NC}"
    curl -s -X PATCH "$BASE_URL/applications/$APPLICATION_ID/assign" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "assignedTo": "admin-user-id",
        "reason": "Assigned for detailed review"
      }' | jq '.'
    echo -e "\n"
  fi
  
else
  echo -e "${RED}No admin token - skipping admin-only routes${NC}\n"
fi

# Test 17: Password Reset Flow
echo -e "${YELLOW}17. Testing Password Reset Request${NC}"
curl -s -X POST "$BASE_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }' | jq '.'
echo -e "\n"

# Test 18: Request Email Verification
echo -e "${YELLOW}18. Requesting Email Verification${NC}"
curl -s -X POST "$BASE_URL/auth/request-email-verification" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }' | jq '.'
echo -e "\n"

echo -e "${GREEN}All tests completed!${NC}"
echo -e "${YELLOW}Note: Some tests might fail if the endpoints require specific data or if the server state doesn't match expectations.${NC}"