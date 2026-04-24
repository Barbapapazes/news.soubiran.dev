export function useUmami() {
  function trackEvent(eventName: string, eventData?: Record<string, unknown>): void {
    if (typeof window === 'undefined' || typeof (window as any).umami === 'undefined') {
      return
    }

    try {
      (window as any).umami.track(eventName, eventData)
    }
    catch {
      // Silently ignore errors to avoid breaking the app if Umami is not available or fails for some reason.
    }
  }

  return {
    trackEvent,
  }
}
