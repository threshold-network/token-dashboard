import { FC } from "react"
import { WalletType } from "../enums"

export interface WalletConnectionModalProps {
  goBack: () => void
  closeModal: () => void
}

export interface WalletOption {
  id: WalletType
  icon: FC
  title: string
}
