import axios from 'axios';

/**
 * Fetch Cryptocurrency News from NewsAPI
 * GET /api/crypto/news
 */
export const getCryptoNews = async (req, res) => {
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
        q: '(bitcoin OR ethereum OR cryptocurrency OR blockchain OR "crypto market" OR altcoin OR DeFi OR NFT) AND (price OR trading OR market OR investment)',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 100,
        apiKey: apiKey,
      },
      timeout: 10000,
    });

    // Transform NewsAPI response to match your Article interface
    const articles = response.data.articles.map((article, index) => ({
      id: article.url ? `${Buffer.from(article.url).toString('base64').substring(0, 12)}-${index}` : `crypto-${Date.now()}-${index}`,
      title: article.title || 'Untitled',
      subtitle: article.description || article.content?.substring(0, 200) || '',
      author: article.author || article.source?.name || 'Staff Writer',
      publishedAt: article.publishedAt || new Date().toISOString(),
      imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1640826514546-05db5ac9e6e8?w=800&q=80',
      url: article.url || '#',
      body: article.content || article.description || '',
      source: article.source?.name || 'NewsAPI',
      tags: extractCryptoTags(article.title + ' ' + article.description),
    }));

    res.json({
      success: true,
      count: articles.length,
      articles: articles,
    });

  } catch (error) {
    console.error('Error fetching crypto news:', error.message);
    
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
      error: 'Failed to fetch crypto news',
      message: error.message 
    });
  }
};

/**
 * Extract cryptocurrency tags from text
 */
function extractCryptoTags(text) {
  if (!text) return [];
  
  const cryptos = {
    'BTC': ['bitcoin', 'btc'],
    'ETH': ['ethereum', 'eth'],
    'SOL': ['solana', 'sol'],
    'XRP': ['ripple', 'xrp'],
    'ADA': ['cardano', 'ada'],
    'DOGE': ['dogecoin', 'doge'],
    'DOT': ['polkadot', 'dot'],
    'AVAX': ['avalanche', 'avax'],
    'LINK': ['chainlink', 'link'],
    'DeFi': ['defi', 'decentralized finance'],
    'NFT': ['nft', 'non-fungible'],
  };
  
  const found = [];
  const textLower = text.toLowerCase();
  
  Object.entries(cryptos).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      found.push(tag);
    }
  });
  
  return [...new Set(found)]; // Remove duplicates
}
