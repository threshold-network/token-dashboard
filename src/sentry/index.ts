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
    beforeBreadcrumb(breadcrumb, hint) {
      if (breadcrumb.category === "ui.click") {
        console.log("BREADCRUMB: ", breadcrumb)
        console.log("HINT: ", hint)
        const { target } = hint?.event
        let buttonName: string
        let buttonURI: string
        let buttonClass: string
        if (
          target?.firstChild?.data &&
          typeof target?.firstChild?.data === "string"
        ) {
          buttonName = target.firstChild.data
        } else if (target?.ariaLabel && typeof target?.ariaLabel === "string") {
          buttonName = target.ariaLabel
        }
        if (target?.baseURI && typeof target?.baseURI === "string") {
          buttonURI = target.baseURI
        }
        if (target?.className) {
          buttonClass = target.classList.toString()
        }
        const button = {
          name: buttonName!,
          url: buttonURI!,
          class: buttonClass!,
        }
        console.log("Clicked button: ")
        console.log("name: ", button.name)
        console.log("url: ", button.url)
        console.log("buttonClass: ", button.class)
        breadcrumb.message = `Button name: ${button.name}; Url: ${button.url}; Class: ${button.class}`
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
