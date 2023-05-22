import { FC } from "react"
import { WalletType } from "../enums"

export interface WalletOption {
  id: WalletType
  icon: FC
  title: string
}
