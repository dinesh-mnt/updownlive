import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testForexAPI() {
  console.log('🧪 Testing Forex News API Integration\n');
  
  const apiKey = process.env.NEWS_API_KEY;
  
  if (!apiKey) {
    console.error('❌ NEWS_API_KEY not found in .env file');
    process.exit(1);
  }
  
  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...\n');
  
  try {
    console.log('📡 Fetching forex news from NewsAPI...');
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'forex OR currency OR "foreign exchange" OR USD OR EUR',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 5,
        apiKey: apiKey,
      },
      timeout: 10000,
    });
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ Total Results:', response.data.totalResults);
    console.log('✅ Articles Received:', response.data.articles.length);
    console.log('\n📰 Sample Articles:\n');
    
    response.data.articles.slice(0, 3).forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Author: ${article.author || 'Unknown'}`);
      console.log(`   Source: ${article.source.name}`);
      console.log(`   Published: ${article.publishedAt}`);
      console.log(`   URL: ${article.url}\n`);
    });
    
    console.log('✅ Test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Start backend: npm run dev');
    console.log('   2. Test endpoint: http://localhost:5000/api/forex/news');
    console.log('   3. Start frontend: cd ../frontend && npm run dev');
    console.log('   4. Visit: http://localhost:3000/forex');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('\n💡 Your API key is invalid. Please check:');
        console.error('   1. Visit https://newsapi.org/account');
        console.error('   2. Copy your API key');
        console.error('   3. Update NEWS_API_KEY in backend/.env');
      } else if (error.response.status === 429) {
        console.error('\n💡 Rate limit exceeded (100 requests/day on free tier)');
        console.error('   Wait 24 hours or upgrade your plan');
      }
    }
    
    process.exit(1);
  }
}

testForexAPI();
