// Test script for AI Categorization API
const testCases = [
  {
    name: 'Coffee Shop Transaction',
    data: {
      description: 'Starbucks Coffee Downtown',
      amount: 5.50,
      type: 'expense',
      merchant: 'Starbucks'
    }
  },
  {
    name: 'Gas Station Transaction',
    data: {
      description: 'Shell Gas Station',
      amount: 45.00,
      type: 'expense',
      merchant: 'Shell'
    }
  },
  {
    name: 'Amazon Purchase',
    data: {
      description: 'Amazon.com purchase',
      amount: 89.99,
      type: 'expense',
      merchant: 'Amazon'
    }
  },
  {
    name: 'Grocery Store',
    data: {
      description: 'Whole Foods Market',
      amount: 125.50,
      type: 'expense',
      merchant: 'Whole Foods'
    }
  },
  {
    name: 'Salary Income',
    data: {
      description: 'Monthly salary deposit',
      amount: 5000.00,
      type: 'income'
    }
  }
];

async function testAPI() {
  console.log('🧪 Testing AI Categorization API\n');
  console.log('=' .repeat(60));

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.name}`);
    console.log(`   Input: ${testCase.data.description} ($${testCase.data.amount})`);
    
    try {
      const response = await fetch('http://localhost:3000/api/ai/categorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });

      if (!response.ok) {
        console.log(`   ❌ Error: ${response.status} ${response.statusText}`);
        const errorData = await response.json();
        console.log(`   ${JSON.stringify(errorData, null, 2)}`);
        continue;
      }

      const result = await response.json();
      console.log(`   ✅ Category: ${result.category}`);
      if (result.subcategory) {
        console.log(`   📂 Subcategory: ${result.subcategory}`);
      }
      console.log(`   🎯 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`   💡 Reasoning: ${result.reasoning}`);
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Testing complete!\n');
}

// Run tests
testAPI().catch(console.error);
