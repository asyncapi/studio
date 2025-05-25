declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const pushEvent = (event: string, data: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...data
    });
  }
};

export const trackPageView = (url: string) => {
  pushEvent('pageview', {
    page_path: url
  });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  pushEvent('customEvent', {
    event_category: category,
    event_action: action,
    event_label: label
  });
};