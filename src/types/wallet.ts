import { FC } from "react"

export interface WalletConnectionModalProps {
  goBack: () => void
  closeModal: () => void
}

export interface WalletOption {
  id: string
  onClick: () => void
  icon: FC
  title: string
}
