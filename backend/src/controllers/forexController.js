import axios from 'axios';

/**
 * Fetch Forex News from NewsAPI
 * GET /api/forex/news
 */
export const getForexNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'NewsAPI key not configured',
        message: 'Please add NEWS_API_KEY to your environment variables'
      });
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'forex OR currency OR "foreign exchange" OR USD OR EUR OR GBP OR JPY',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 100,
        apiKey: apiKey,
      },
      timeout: 10000, // 10 second timeout
    });

    // Transform NewsAPI response to match your ForexArticle interface
    const articles = response.data.articles.map((article, index) => ({
      id: article.url ? `${Buffer.from(article.url).toString('base64').substring(0, 12)}-${index}` : `article-${Date.now()}-${index}`,
      title: article.title || 'Untitled',
      subtitle: article.description || article.content?.substring(0, 200) || '',
      author: article.author || article.source?.name || 'Unknown',
      publishedAt: article.publishedAt || new Date().toISOString(),
      imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      url: article.url || '#',
      body: article.content || article.description || '',
      source: article.source?.name || 'NewsAPI',
      currencies: extractCurrencies(article.title + ' ' + article.description),
    }));

    res.json({
      success: true,
      count: articles.length,
      articles: articles,
    });

  } catch (error) {
    console.error('Error fetching forex news:', error.message);
    
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: 'NewsAPI rate limit reached. Please try again later.'
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        message: 'NewsAPI key is invalid. Please check your configuration.'
      });
    }

    res.status(500).json({ 
      error: 'Failed to fetch forex news',
      message: error.message 
    });
  }
};

/**
 * Extract currency codes from text
 */
function extractCurrencies(text) {
  if (!text) return [];
  
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'SEK'];
  const found = [];
  
  currencies.forEach(currency => {
    if (text.toUpperCase().includes(currency)) {
      found.push(currency);
    }
  });
  
  return [...new Set(found)]; // Remove duplicates
}
