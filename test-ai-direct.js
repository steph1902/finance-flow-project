// Direct test of AI categorization service (bypassing auth)
const { geminiClient } = require('./src/lib/ai/gemini-client.ts');
const { createCategorizationPrompt } = require('./src/lib/ai/prompts/categorization.ts');

async function testCategorizationLogic() {
  console.log('🧪 Testing AI Categorization Logic (Direct)\n');
  console.log('='.repeat(60));

  const testCases = [
    {
      description: 'Starbucks Coffee Downtown',
      amount: 5.50,
      type: 'expense',
      merchant: 'Starbucks'
    },
    {
      description: 'Shell Gas Station',
      amount: 45.00,
      type: 'expense',
      merchant: 'Shell'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.description}`);
    
    try {
      const prompt = createCategorizationPrompt(testCase);
      console.log('   🤖 Sending to Gemini AI...');
      
      const response = await geminiClient.generateStructuredContent(prompt);
      
      console.log(`   ✅ Category: ${response.category}`);
      if (response.subcategory) {
        console.log(`   📂 Subcategory: ${response.subcategory}`);
      }
      console.log(`   🎯 Confidence: ${(response.confidence * 100).toFixed(1)}%`);
      console.log(`   💡 Reasoning: ${response.reasoning}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Testing complete!\n');
}

testCategorizationLogic().catch(console.error);
