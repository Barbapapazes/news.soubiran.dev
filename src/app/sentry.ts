import type { App } from 'vue'
import type { Router } from 'vue-router'
import * as Sentry from '@sentry/vue'

export function setupSentry(app: App, router: Router) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    integrations: [
      Sentry.browserTracingIntegration({
        router,
      }),
    ],
    sendDefaultPii: true,
    tracePropagationTargets: ['/api', import.meta.env.VITE_BASE_API_URL],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE),
  })
}
