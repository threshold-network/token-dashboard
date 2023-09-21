import { FC } from "react"
import { WalletType } from "../enums"

export interface WalletOption {
  id: WalletType
  title: string
  icon: {
    light: FC
    dark: FC
  }
}
