import { FC } from "react"
import { WalletType } from "../enums"

export interface WalletOption {
  id: WalletType | "Starknet"
  title: string
  icon: {
    light: FC
    dark: FC
  }
}
