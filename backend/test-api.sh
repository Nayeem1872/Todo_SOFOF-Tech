#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${YELLOW}Testing NestJS Todo API${NC}\n"

# Test 1: Login
echo -e "${YELLOW}1. Testing Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
else
  echo -e "${GREEN}✓ Login successful${NC}"
  echo "Token: ${TOKEN:0:20}..."
fi

# Test 2: Create Todo
echo -e "\n${YELLOW}2. Creating a Todo...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/todos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Todo",
    "description": "This is a test todo",
    "status": "PENDING"
  }')

TODO_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$TODO_ID" ]; then
  echo -e "${RED}❌ Create todo failed${NC}"
  echo "Response: $CREATE_RESPONSE"
else
  echo -e "${GREEN}✓ Todo created successfully${NC}"
  echo "Todo ID: $TODO_ID"
fi

# Test 3: Get All Todos
echo -e "\n${YELLOW}3. Getting all Todos...${NC}"
GET_ALL_RESPONSE=$(curl -s -X GET "$BASE_URL/todos" \
  -H "Authorization: Bearer $TOKEN")

if [[ $GET_ALL_RESPONSE == *"$TODO_ID"* ]]; then
  echo -e "${GREEN}✓ Get all todos successful${NC}"
else
  echo -e "${RED}❌ Get all todos failed${NC}"
fi

# Test 4: Get Todo by ID
echo -e "\n${YELLOW}4. Getting Todo by ID...${NC}"
GET_ONE_RESPONSE=$(curl -s -X GET "$BASE_URL/todos/$TODO_ID" \
  -H "Authorization: Bearer $TOKEN")

if [[ $GET_ONE_RESPONSE == *"$TODO_ID"* ]]; then
  echo -e "${GREEN}✓ Get todo by ID successful${NC}"
else
  echo -e "${RED}❌ Get todo by ID failed${NC}"
fi

# Test 5: Update Todo
echo -e "\n${YELLOW}5. Updating Todo...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/todos/$TODO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Todo",
    "status": "IN_PROGRESS"
  }')

if [[ $UPDATE_RESPONSE == *"Updated Test Todo"* ]]; then
  echo -e "${GREEN}✓ Update todo successful${NC}"
else
  echo -e "${RED}❌ Update todo failed${NC}"
fi

# Test 6: Filter by Status
echo -e "\n${YELLOW}6. Filtering Todos by Status...${NC}"
FILTER_RESPONSE=$(curl -s -X GET "$BASE_URL/todos?status=IN_PROGRESS" \
  -H "Authorization: Bearer $TOKEN")

if [[ $FILTER_RESPONSE == *"IN_PROGRESS"* ]]; then
  echo -e "${GREEN}✓ Filter by status successful${NC}"
else
  echo -e "${RED}❌ Filter by status failed${NC}"
fi

# Test 7: Delete Todo
echo -e "\n${YELLOW}7. Deleting Todo...${NC}"
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/todos/$TODO_ID" \
  -H "Authorization: Bearer $TOKEN")

echo -e "${GREEN}✓ Delete todo successful${NC}"

# Test 8: Verify Deletion
echo -e "\n${YELLOW}8. Verifying Deletion...${NC}"
VERIFY_RESPONSE=$(curl -s -X GET "$BASE_URL/todos/$TODO_ID" \
  -H "Authorization: Bearer $TOKEN")

if [[ $VERIFY_RESPONSE == *"not found"* ]] || [[ $VERIFY_RESPONSE == *"null"* ]]; then
  echo -e "${GREEN}✓ Todo deleted successfully${NC}"
else
  echo -e "${RED}❌ Todo still exists${NC}"
fi

echo -e "\n${GREEN}All tests completed!${NC}"
echo -e "\n${YELLOW}Access Swagger documentation at: ${BASE_URL}/api${NC}"
