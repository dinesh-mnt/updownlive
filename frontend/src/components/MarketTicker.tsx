"use client";
import React, { useEffect, useRef, memo } from 'react';

function MarketTicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only append the script on the client side
    if (!containerRef.current) return;
    
    // Clear out any previous scripts to avoid duplicates in React strict mode
    containerRef.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "FX_IDC:EURUSD",
          title: "EUR/USD"
        },
        {
          proName: "FX:USDJPY",
          title: "USD/JPY"
        },
        {
          proName: "FX:GBPUSD",
          title: "GBP/USD"
        },
        {
          proName: "FX:AUDUSD",
          title: "AUD/USD"
        },
        {
          proName: "BITSTAMP:BTCUSD",
          title: "Bitcoin"
        },
        {
          proName: "BITSTAMP:ETHUSD",
          title: "Ethereum"
        },
        {
          proName: "FOREXCOM:SPXUSD",
          title: "S&P 500"
        },
        {
          proName: "OANDA:XAUUSD",
          title: "Gold"
        }
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "regular",
      colorTheme: "light",
      locale: "en"
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full bg-white border-b border-brand-border">
      {/* Container must have exact classes for TradingView to target */}
      <div 
        className="tradingview-widget-container" 
        ref={containerRef}
        style={{ height: '46px', overflow: 'hidden' }}
      >
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}

export default memo(MarketTicker);
