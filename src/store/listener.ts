import {
  createListenerMiddleware,
  ListenerEffectAPI,
  TypedStartListening,
} from "@reduxjs/toolkit"
import { AppDispatch, RootState } from "."
import { Threshold } from "../threshold-ts"
import { threshold } from "../utils/getThresholdLib"

export const listenerMiddleware = createListenerMiddleware({
  extra: { threshold },
})

export type ExtraArgument = {
  threshold: Threshold
}

export type AppStartListening = TypedStartListening<
  RootState,
  AppDispatch,
  ExtraArgument
>

export type AppListenerEffectAPI = ListenerEffectAPI<
  RootState,
  AppDispatch,
  ExtraArgument
>

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening
