"use client";
import React, { useEffect, useRef, memo, useState, useId } from 'react';
import { Loader2, AlertCircle, RefreshCw, TrendingUp } from 'lucide-react';

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  height?: number;
  showToolbar?: boolean;
  showLegend?: boolean;
  autosize?: boolean;
}

function TradingViewChart({
  symbol = "NASDAQ:AAPL",
  interval = "D",
  height = 600,
  showToolbar = true,
  showLegend = true,
  autosize = true
}: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const id = useId();
  const widgetId = `tradingview_${id.replace(/:/g, '')}`;

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
      
      const config = {
        autosize,
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme: "light",
        style: "1",
        locale: "en",
        enable_publishing: false,
        backgroundColor: "rgba(255, 255, 255, 1)",
        gridColor: "rgba(234, 234, 234, 1)",
        hide_top_toolbar: !showToolbar,
        hide_legend: !showLegend,
        save_image: false,
        calendar: false,
        hide_volume: false,
        support_host: "https://www.tradingview.com",
        container_id: widgetId,
        ...(autosize ? {} : { width: "100%", height: height.toString() })
      };
      
      script.innerHTML = JSON.stringify(config);
      
      // Handle script load events
      script.onload = () => {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      };
      
      script.onerror = () => {
        setError('Failed to load TradingView chart');
        setLoading(false);
      };
      
      container.current.appendChild(script);
      
    } catch (err) {
      setError('Error initializing TradingView chart');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Suppress TradingView's "contentWindow is not available" warning —
    // it fires internally when the iframe hasn't fully mounted yet and is harmless.
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('contentWindow is not available')) return;
      originalError(...args);
    };

    const timer = setTimeout(() => {
      loadWidget();
    }, 300);

    return () => {
      clearTimeout(timer);
      console.error = originalError;
    };
  }, [symbol, interval, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div 
      className="w-full bg-white rounded-xl overflow-hidden shadow-lg border border-brand-border relative"
      style={{ height: `${height}px` }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <div className="relative mb-4">
              <TrendingUp className="w-12 h-12 text-brand-blue mx-auto" />
              <Loader2 className="w-6 h-6 text-brand-blue animate-spin absolute -top-1 -right-1" />
            </div>
            <p className="text-sm font-medium text-brand-gray">Loading {symbol} Chart...</p>
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
        <div className="tradingview-widget-container__widget h-full w-full" id={widgetId}></div>
      </div>
    </div>
  );
}

export default memo(TradingViewChart);