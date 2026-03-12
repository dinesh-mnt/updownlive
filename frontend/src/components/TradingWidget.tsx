"use client";
import React, { useEffect, useRef, memo, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

function TradingWidget() {
  const container = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadWidget = () => {
    if (!container.current) return;
    
    setLoading(true);
    setError(null);
    
    // Clear previous content
    container.current.innerHTML = '';
    
    try {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      
      // Enhanced widget configuration
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": "NASDAQ:AAPL",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(255, 255, 255, 1)",
        "gridColor": "rgba(234, 234, 234, 1)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "calendar": false,
        "hide_volume": false,
        "support_host": "https://www.tradingview.com",
        "container_id": "tradingview_widget"
      });
      
      // Handle script load events
      script.onload = () => {
        setTimeout(() => {
          setLoading(false);
        }, 2000); // Give widget time to fully load
      };
      
      script.onerror = () => {
        setError('Failed to load TradingView widget');
        setLoading(false);
      };
      
      container.current.appendChild(script);
      
    } catch (err) {
      setError('Error initializing TradingView widget');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      loadWidget();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="w-full h-[600px] bg-white rounded-xl overflow-hidden shadow-lg border border-brand-border relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-brand-blue animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-brand-gray">Loading TradingView Chart...</p>
            <p className="text-xs text-gray-500 mt-1">Connecting to live market data</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-black mb-2">Chart Loading Error</h3>
            <p className="text-sm text-brand-gray mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors"
            >
              <RefreshCw size={16} />
              Retry Loading
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Powered by <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">TradingView</a>
            </p>
          </div>
        </div>
      )}
      
      <div className="tradingview-widget-container h-full w-full" ref={container}>
        <div className="tradingview-widget-container__widget h-full w-full" id="tradingview_widget"></div>
      </div>
    </div>
  );
}

export default memo(TradingWidget);
