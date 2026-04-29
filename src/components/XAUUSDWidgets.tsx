import React, { useEffect, useRef } from 'react';

interface WidgetProps {
  symbol: string;
}

const TradingViewEmbed = ({ scriptSrc, config, height = '400px' }: { scriptSrc: string, config: any, height?: string }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;

    // Limpeza prévia para evitar duplicatas e "consumer expired"
    currentContainer.innerHTML = '';
    
    // Criação do container interno para o widget
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    currentContainer.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    
    currentContainer.appendChild(script);

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [scriptSrc, JSON.stringify(config)]);

  return (
    <div 
      className="tradingview-widget-container w-full h-full min-h-[inherit]" 
      ref={container}
    >
      {/* O widget será injetado aqui pelo useEffect */}
    </div>
  );
};

export const XAUUSDWidgets = ({ symbol = "OANDA:XAUUSD" }: WidgetProps) => {
  return (
    <div className="w-full space-y-8 mt-12 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
        <h3 className="text-sm font-black uppercase tracking-widest text-white">Análise Gráfica & Técnica (TradingView)</h3>
      </div>

      {/* Row 1: Widget 1 (Symbol Info) & Widget 4 (Technical Analysis) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[410px]">
        {/* Widget 1: Symbol Info */}
        <div className="glass-card rounded-[2.5rem] border border-white/5 bg-[#0F0F0F]/50 overflow-hidden relative p-8 h-full flex flex-col items-center justify-center min-h-[410px]">
          <div className="w-full h-auto">
            <TradingViewEmbed 
              height="auto"
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
              config={{
                "symbol": symbol,
                "colorTheme": "dark",
                "isTransparent": true,
                "locale": "en",
                "width": "100%"
              }}
            />
          </div>
        </div>

        {/* Widget 4: Technical Analysis */}
        <div className="glass-card rounded-[2.5rem] border border-white/5 bg-[#0F0F0F]/50 overflow-hidden relative p-8 h-full flex flex-col justify-center min-h-[410px]">
          <TradingViewEmbed 
            height="100%"
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
            config={{
              "colorTheme": "dark",
              "displayMode": "single",
              "isTransparent": true,
              "locale": "en",
              "interval": "5m",
              "disableInterval": false,
              "width": "100%",
              "height": "100%",
              "symbol": symbol,
              "showIntervalTabs": true
            }}
          />
        </div>
      </div>

      {/* Row 2: Widget 3 (Full Width Advanced Chart) */}
      <div className="w-full h-[650px]">
        <div className="glass-card rounded-[2.5rem] border border-white/5 bg-[#0F0F0F] overflow-hidden relative p-1 h-full w-full">
          <TradingViewEmbed 
            height="100%"
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
            config={{
              "allow_symbol_change": false,
              "calendar": false,
              "details": false,
              "hide_side_toolbar": false,
              "hide_top_toolbar": false,
              "hide_legend": false,
              "hide_volume": true,
              "hotlist": false,
              "interval": "5",
              "locale": "en",
              "save_image": false,
              "style": "1",
              "symbol": symbol,
              "theme": "dark",
              "timezone": "Etc/UTC",
              "backgroundColor": "#0F0F0F",
              "gridColor": "rgba(242, 242, 242, 0.06)",
              "watchlist": [],
              "withdateranges": true,
              "compareSymbols": [],
              "studies": [],
              "autosize": true
            }}
          />
        </div>
      </div>
    </div>
  );
};
