/**
 * Suppress harmless TradingView iframe errors
 * 
 * TradingView widgets create iframes that sometimes try to communicate
 * with the parent window before being fully loaded, causing console errors.
 * These errors are harmless and don't affect functionality.
 */

let isErrorSuppressionActive = false;
let originalConsoleError: typeof console.error;

export function suppressTradingViewErrors() {
  if (isErrorSuppressionActive) return;
  
  if (typeof window === 'undefined') return;
  
  originalConsoleError = console.error;
  
  console.error = (...args: any[]) => {
    const errorMessage = args[0]?.toString() || '';
    
    // List of error patterns to suppress
    const suppressPatterns = [
      'contentWindow',
      'Cannot listen to the event from the provided iframe',
      'tradingview',
      'embed-widget'
    ];
    
    // Check if error matches any suppression pattern
    const shouldSuppress = suppressPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (shouldSuppress) {
      // Silently ignore these errors
      return;
    }
    
    // Pass through all other errors
    originalConsoleError.apply(console, args);
  };
  
  isErrorSuppressionActive = true;
}

export function restoreConsoleError() {
  if (!isErrorSuppressionActive) return;
  
  if (originalConsoleError) {
    console.error = originalConsoleError;
  }
  
  isErrorSuppressionActive = false;
}

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  suppressTradingViewErrors();
}
