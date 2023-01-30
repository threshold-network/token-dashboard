import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import { getEnvVariable } from "../utils/getEnvVariable"
import { EnvVariable } from "../enums"
import { Primitive } from "@sentry/types"

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
  params?: { [key: string]: unknown },
  tags?: { [key: string]: Primitive }
) => {
  Sentry.withScope((scope) => {
    if (params) {
      scope.setExtras(params)
    }

    if (tags) {
      scope.setTags(tags)
    }

    Sentry.captureMessage(message)
  })
}
