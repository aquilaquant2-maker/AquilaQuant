import ReactPixel from 'react-facebook-pixel';

const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID;

export const initPixel = () => {
  if (typeof window !== 'undefined') {
    if (!PIXEL_ID) {
      console.warn('⚠️ FB_PIXEL_ID não encontrado nas variáveis de ambiente (VITE_FB_PIXEL_ID).');
      return;
    }

    console.log(`🚀 Inicializando Facebook Pixel: ${PIXEL_ID}`);
    
    const options = {
      autoConfig: true,
      debug: false,
    };

    ReactPixel.init(PIXEL_ID, undefined, options);
  }
};

export const trackPageView = () => {
  if (typeof window !== 'undefined' && PIXEL_ID) {
    ReactPixel.pageView();
  }
};

export const trackPurchase = (value: number = 0, currency: string = 'BRL') => {
  if (typeof window !== 'undefined' && PIXEL_ID) {
    ReactPixel.track('Purchase', {
      value,
      currency,
    });
  }
};

export const trackInitiateCheckout = () => {
  if (typeof window !== 'undefined' && PIXEL_ID) {
    ReactPixel.track('InitiateCheckout');
  }
};

export const trackCustomEvent = (event: string, data?: any) => {
  if (typeof window !== 'undefined' && PIXEL_ID) {
    ReactPixel.trackCustom(event, data);
  }
};
