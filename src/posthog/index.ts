import posthog from "posthog-js"
import { EnvVariable } from "../enums"
import { getEnvVariable } from "../utils/getEnvVariable"
import { PosthogEvent } from "../types/posthog"

export const init = () => {
  const apiKey = getEnvVariable(EnvVariable.POSTHOG_API_KEY)
  const apiHost = getEnvVariable(EnvVariable.POSTHOG_HOSTNAME_HTTP)

  if (!apiKey || !apiHost) {
    throw new Error("Could not initialize posthog.")
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    // T dapp is a single page app so we need to make a `pageview` call
    // manually. It also prevents sending the `pageview` event on posthog
    // initialization.
    capture_pageview: false,
    persistence: "memory",
  })
}

export const identify = (ethAddress: string) => {
  posthog.identify(ethAddress)
}

// Posthog automatically sends pageview events whenever it gets loaded. For a
// one-page app, this means it will only send a `pageview` once, when the app
// loads. To make sure any navigating a user does within your app gets captured,
// you must make a `pageview` call manually.
export const capturePageview = () => {
  posthog.capture("$pageview")
}

export const reset = () => {
  posthog.reset()
}

export const capture = (
  event: PosthogEvent,
  params: { [key: string]: unknown }
) => {
  posthog.capture(event, params)
}
