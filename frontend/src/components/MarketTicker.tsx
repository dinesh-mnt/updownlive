"use client";
import React, { useEffect, useRef, memo } from 'react';

function MarketTicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timer: ReturnType<typeof setTimeout>;

    // Remove any previously injected script to avoid duplicates on hot-reload
    const prev = container.querySelector('script');
    if (prev) prev.remove();

    // Reset the widget target div
    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    // Delay slightly so the DOM node is fully painted before TradingView queries it
    timer = setTimeout(() => {
      if (!containerRef.current) return;

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          { proName: 'FX_IDC:EURUSD', title: 'EUR/USD' },
          { proName: 'FX:USDJPY', title: 'USD/JPY' },
          { proName: 'FX:GBPUSD', title: 'GBP/USD' },
          { proName: 'FX:AUDUSD', title: 'AUD/USD' },
          { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
          { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
          { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
          { proName: 'OANDA:XAUUSD', title: 'Gold' },
        ],
        showSymbolLogo: true,
        isTransparent: false,
        displayMode: 'regular',
        colorTheme: 'light',
        locale: 'en',
      });

      containerRef.current.appendChild(script);
    }, 500);

    return () => {
      clearTimeout(timer);
      // Clean up on unmount so orphaned scripts don't run against a removed DOM node
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className="w-full bg-white border-b border-brand-border">
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
