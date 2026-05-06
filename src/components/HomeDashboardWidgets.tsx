import React, { useEffect, useRef } from 'react';
import { SUPPORTED_ASSETS } from '../constants/assets';

const TradingViewEmbed = ({ scriptSrc, config }: { scriptSrc: string, config: any }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;

    // Limpeza prévia para evitar duplicatas e instabilidades
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

export const HomeDashboardWidgets = () => {
  return (
    <div className="p-4 md:p-8 pb-12 flex flex-col gap-6 md:gap-8 max-w-[1700px] mx-auto w-full">
      {/* Row 1: Market Overview & Market Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 min-h-0 lg:min-h-[600px]">
        {/* Widget 1: Market Overview (2/3) */}
        <div className="lg:col-span-2 glass-card rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-[#0F0F0F]/50 overflow-hidden p-4 md:p-6 h-[500px] md:h-[600px]">
          <TradingViewEmbed 
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
            config={{
              "colorTheme": "dark",
              "dateRange": "1D",
              "locale": "en",
              "largeChartUrl": "",
              "isTransparent": true,
              "showFloatingTooltip": true,
              "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
              "plotLineColorFalling": "rgba(41, 98, 255, 1)",
              "gridLineColor": "rgba(240, 243, 250, 0)",
              "scaleFontColor": "#DBDBDB",
              "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
              "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
              "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
              "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
              "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
              "tabs": [
                {
                  "title": "B3",
                  "symbols": SUPPORTED_ASSETS
                    .filter(a => a.type === 'B3')
                    .map(a => ({ "s": a.tradingViewSymbol, "d": a.nameFull }))
                },
                {
                  "title": "Forex",
                  "symbols": SUPPORTED_ASSETS
                    .filter(a => a.type === 'Forex')
                    .map(a => ({ "s": a.tradingViewSymbol, "d": a.nameFull }))
                }
              ],
              "support_host": "https://www.tradingview.com",
              "width": "100%",
              "height": "100%",
              "showSymbolLogo": true,
              "showChart": true
            }}
          />
        </div>

        {/* Widget 2: Market Quotes (1/3) */}
        <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-[#0F0F0F]/50 overflow-hidden p-4 md:p-6 h-[500px] md:h-[600px]">
          <TradingViewEmbed 
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
            config={{
              "colorTheme": "dark",
              "locale": "en",
              "largeChartUrl": "",
              "isTransparent": true,
              "showSymbolLogo": true,
              "backgroundColor": "#0F0F0F",
              "support_host": "https://www.tradingview.com",
              "width": "100%",
              "height": "100%",
              "symbolsGroups": [
                {
                  "name": "B3",
                  "symbols": SUPPORTED_ASSETS
                    .filter(a => a.type === 'B3')
                    .map(a => ({ "name": a.tradingViewSymbol, "displayName": a.nameFull }))
                },
                {
                  "name": "Forex",
                  "symbols": SUPPORTED_ASSETS
                    .filter(a => a.type === 'Forex')
                    .map(a => ({ "name": a.tradingViewSymbol, "displayName": a.nameFull }))
                }
              ]
            }}
          />
        </div>
      </div>

      {/* Row 2: Heatmap & News Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Widget 4: Forex Heatmap */}
        <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-[#0F0F0F]/50 overflow-hidden p-4 md:p-6 h-[400px] md:h-[450px]">
          <TradingViewEmbed 
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js"
            config={{
              "colorTheme": "dark",
              "isTransparent": true,
              "locale": "en",
              "currencies": ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD", "CNY"],
              "width": "100%",
              "height": "100%"
            }}
          />
        </div>

        {/* Widget 6: Timeline */}
        <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-[#0F0F0F]/50 overflow-hidden p-4 md:p-6 h-[400px] md:h-[450px]">
          <TradingViewEmbed 
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
            config={{
              "displayMode": "regular",
              "feedMode": "all_symbols",
              "colorTheme": "dark",
              "isTransparent": true,
              "locale": "en",
              "width": "100%",
              "height": "100%"
            }}
          />
        </div>
      </div>

      {/* Row 3: Screener Full Width */}
      <div className="w-full">
        <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-[#0F0F0F]/50 overflow-hidden p-4 md:p-6 h-[500px] md:h-[600px]">
          <TradingViewEmbed 
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
            config={{
              "defaultColumn": "moving_averages",
              "screener_type": "forex",
              "displayCurrency": "USD",
              "colorTheme": "dark",
              "isTransparent": true,
              "locale": "en",
              "width": "100%",
              "height": "100%"
            }}
          />
        </div>
      </div>

      {/* Row 4: Economic Calendar (Investing.com) */}
      <div className="w-full">
        <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-[#0F0F0F]/50 overflow-hidden p-4 md:p-8 min-h-[450px] md:min-h-[550px] flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Calendário Econômico</h3>
            </div>
            <div className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Powered by <span className="text-trading-green">Investing.com</span>
            </div>
          </div>
          <div className="flex-1 rounded-[1.5rem] md:rounded-3xl overflow-hidden bg-white/5 border border-white/5 flex justify-center items-center p-2 md:p-4">
            <iframe 
              src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=day&timeZone=8&lang=1" 
              width="650" 
              height="467" 
              title="Investing.com Economic Calendar"
              className="max-w-full border-0 min-h-[400px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
