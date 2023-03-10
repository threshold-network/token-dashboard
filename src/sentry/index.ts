import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import { getEnvVariable } from "../utils/getEnvVariable"
import { EnvVariable } from "../enums"
import { Primitive } from "@sentry/types"

interface SentryUIElement {
  name: string | undefined
  type: string | undefined
  url: string | undefined
  class: string | undefined
  id: string | undefined
}

export const init = () => {
  const dsn = getEnvVariable(EnvVariable.SENTRY_DSN)

  Sentry.init({
    dsn: dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.5,
    beforeBreadcrumb(breadcrumb, hint) {
      if (breadcrumb.category === "ui.click") {
        const element: SentryUIElement = {
          name: undefined,
          type: undefined,
          url: undefined,
          class: undefined,
          id: undefined,
        }
        const { target } = hint?.event

        if (target) {
          if (
            target.firstChild?.data &&
            typeof target?.firstChild?.data === "string"
          ) {
            element.name = target.firstChild.data
          } else if (target.ariaLabel && typeof target.ariaLabel === "string") {
            element.name = target.ariaLabel
          }
          element.url = target.baseURI || undefined
          element.type = target.localName ? `<${target.localName}>` : undefined
          element.class = target.classList?.toString() || undefined
          element.id = target.id || undefined
        }

        breadcrumb.message = `Element name: ${element.name}; Type: ${element.type}; Url: ${element.url}; Class: ${element.class}; Id: ${element.id}`
      }
      return breadcrumb
    },
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
