export const analytics = {
  logEvent(eventName: string, params?: Record<string, any>) {
    console.log(`[Analytics Event] ${eventName}`, params || '');
  },
  
  setCurrentScreen(screenName: string) {
    console.log(`[Analytics Screen] ${screenName}`);
  },
};
