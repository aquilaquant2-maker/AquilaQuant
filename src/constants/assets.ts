export interface Asset {
  symbol: string;
  name: string;
  nameFull: string;
  type: 'B3' | 'Forex';
  view: string;
  tradingViewSymbol: string;
}

export const SUPPORTED_ASSETS: Asset[] = [
  { 
    symbol: 'WDO/DOL', 
    name: 'MINI DÓLAR', 
    nameFull: 'Mini Dólar',
    type: 'B3', 
    view: 'MINI_DOLAR',
    tradingViewSymbol: 'BMFBOVESPA:WDO1!'
  },
  { 
    symbol: 'WIN/IND', 
    name: 'MINI ÍNDICE', 
    nameFull: 'Mini Índice',
    type: 'B3', 
    view: 'MINI_INDICE',
    tradingViewSymbol: 'BMFBOVESPA:WIN1!'
  },
  { 
    symbol: 'XAU/USD', 
    name: 'XAU/USD', 
    nameFull: 'XAU to USD',
    type: 'Forex', 
    view: 'XAU_USD',
    tradingViewSymbol: 'OANDA:XAUUSD'
  },
  { 
    symbol: 'EUR/USD', 
    name: 'EUR/USD', 
    nameFull: 'EUR to USD',
    type: 'Forex', 
    view: 'EUR_USD',
    tradingViewSymbol: 'FX:EURUSD'
  },
  { 
    symbol: 'USD/JPY', 
    name: 'USD/JPY', 
    nameFull: 'USD to JPY',
    type: 'Forex', 
    view: 'USD_JPY',
    tradingViewSymbol: 'FX:USDJPY'
  },
  { 
    symbol: 'GBP/USD', 
    name: 'GBP/USD', 
    nameFull: 'GBP to USD',
    type: 'Forex', 
    view: 'GBP_USD',
    tradingViewSymbol: 'FX:GBPUSD'
  },
  { 
    symbol: 'USD/CHF', 
    name: 'USD/CHF', 
    nameFull: 'USD to CHF',
    type: 'Forex', 
    view: 'USD_CHF',
    tradingViewSymbol: 'FX:USDCHF'
  },
  { 
    symbol: 'AUD/USD', 
    name: 'AUD/USD', 
    nameFull: 'AUD to USD',
    type: 'Forex', 
    view: 'AUD_USD',
    tradingViewSymbol: 'FX:AUDUSD'
  },
  { 
    symbol: 'USD/CAD', 
    name: 'USD/CAD', 
    nameFull: 'USD to CAD',
    type: 'Forex', 
    view: 'USD_CAD',
    tradingViewSymbol: 'FX:USDCAD'
  },
  { 
    symbol: 'NZD/USD', 
    name: 'NZD/USD', 
    nameFull: 'NZD to USD',
    type: 'Forex', 
    view: 'NZD_USD',
    tradingViewSymbol: 'FX:NZDUSD'
  },
  { 
    symbol: 'EUR/JPY', 
    name: 'EUR/JPY', 
    nameFull: 'EUR to JPY',
    type: 'Forex', 
    view: 'EUR_JPY',
    tradingViewSymbol: 'FX:EURJPY'
  },
  { 
    symbol: 'GBP/JPY', 
    name: 'GBP/JPY', 
    nameFull: 'GBP to JPY',
    type: 'Forex', 
    view: 'GBP_JPY',
    tradingViewSymbol: 'FX:GBPJPY'
  },
];

export const CATEGORIES = ['B3', 'Forex'] as const;
