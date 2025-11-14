#!/bin/bash

echo "Testing AI Categorization API..."
echo ""

# Test 1: Coffee shop transaction
echo "Test 1: Coffee Shop Transaction"
curl -X POST http://localhost:3000/api/ai/categorize \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Starbucks Coffee Downtown",
    "amount": 5.50,
    "type": "expense",
    "merchant": "Starbucks"
  }'
echo -e "\n"

# Test 2: Gas station
echo "Test 2: Gas Station Transaction"
curl -X POST http://localhost:3000/api/ai/categorize \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Shell Gas Station",
    "amount": 45.00,
    "type": "expense",
    "merchant": "Shell"
  }'
echo -e "\n"

# Test 3: Online shopping
echo "Test 3: Amazon Purchase"
curl -X POST http://localhost:3000/api/ai/categorize \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Amazon.com purchase",
    "amount": 89.99,
    "type": "expense",
    "merchant": "Amazon"
  }'
echo -e "\n"

# Test 4: Income
echo "Test 4: Salary Income"
curl -X POST http://localhost:3000/api/ai/categorize \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Monthly salary deposit",
    "amount": 5000.00,
    "type": "income"
  }'
echo -e "\n"

echo "Testing complete!"
