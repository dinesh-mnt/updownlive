import axios from 'axios';

/**
 * Fetch Gold & Precious Metals News from NewsAPI
 * GET /api/gold/news
 */
export const getGoldNews = async (req, res) => {
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
        q: '("gold futures" OR XAUUSD OR bullion OR "precious metals" OR silver OR platinum OR palladium) AND (market OR price OR trading OR investment)',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 100,
        apiKey: apiKey,
      },
      timeout: 10000,
    });

    // Transform NewsAPI response to match your Article interface
    const articles = response.data.articles.map((article, index) => ({
      id: article.url ? `${Buffer.from(article.url).toString('base64').substring(0, 12)}-${index}` : `gold-${Date.now()}-${index}`,
      title: article.title || 'Untitled',
      subtitle: article.description || article.content?.substring(0, 200) || '',
      author: article.author || article.source?.name || 'Staff Writer',
      publishedAt: article.publishedAt || new Date().toISOString(),
      imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
      url: article.url || '#',
      body: article.content || article.description || '',
      source: article.source?.name || 'NewsAPI',
      tags: extractMetalTags(article.title + ' ' + article.description),
    }));

    res.json({
      success: true,
      count: articles.length,
      articles: articles,
    });

  } catch (error) {
    console.error('Error fetching gold news:', error.message);
    
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
      error: 'Failed to fetch gold news',
      message: error.message 
    });
  }
};

/**
 * Extract precious metal tags from text
 */
function extractMetalTags(text) {
  if (!text) return [];
  
  const metals = {
    'XAU': ['gold', 'xau'],
    'XAG': ['silver', 'xag'],
    'XPT': ['platinum', 'xpt'],
    'XPD': ['palladium', 'xpd'],
    'USD': ['usd', 'dollar'],
  };
  
  const found = [];
  const textLower = text.toLowerCase();
  
  Object.entries(metals).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      found.push(tag);
    }
  });
  
  return [...new Set(found)]; // Remove duplicates
}
