import { ComponentType } from "react"
import KeepCircleBrand from "./KeepCircleBrand"
import NuCircleBrand from "./NuCircleBrand"
import ThresholdCircleBrand from "./ThresholdCircleBrand"

const tokenIcons = [
  "KEEP_CIRCLE_BRAND",
  "NU_CIRCLE_BRAND",
  "T_CIRCLE_BRAND",
] as const

export type TokenIcon = (typeof tokenIcons)[number]

const tokenIconMap: Record<TokenIcon, ComponentType> = {
  KEEP_CIRCLE_BRAND: KeepCircleBrand,
  NU_CIRCLE_BRAND: NuCircleBrand,
  T_CIRCLE_BRAND: ThresholdCircleBrand,
}

export default tokenIconMap
