import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import { getEnvVariable } from "../utils/getEnvVariable"
import { EnvVariable } from "../enums"

export const init = () => {
  const dsn = getEnvVariable(EnvVariable.SENTRY_DSN)

  Sentry.init({
    dsn: dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.5,
  })
}

export const captureMessage = (
  message: string,
  params: { [key: string]: unknown }
) => {
  Sentry.withScope((scope) => {
    // eslint-disable-next-line guard-for-in
    for (const key in params) {
      scope.setExtra(key, params[key])
    }

    Sentry.captureMessage(message)
  })
}
