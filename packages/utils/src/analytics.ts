declare const __DEV__: boolean;

export const analytics = {
  logEvent(eventName: string, params?: Record<string, any>) {
    if (__DEV__) {
      console.log(`[Analytics Event] ${eventName}`, params || '');
    }
  },
  
  setCurrentScreen(screenName: string) {
    if (__DEV__) {
      console.log(`[Analytics Screen] ${screenName}`);
    }
  },
};


