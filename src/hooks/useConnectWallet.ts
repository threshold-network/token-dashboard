import { useCallback } from "react"
import { ModalType } from "../enums"
import { useRequestEthereumAccount } from "./ledger-live-app"
import { useIsEmbed } from "./useIsEmbed"
import { useModal } from "./useModal"

export const useConnectWallet = (): (() => void) => {
  const { isEmbed } = useIsEmbed()
  const { requestAccount } = useRequestEthereumAccount()
  const { openModal } = useModal()

  return useCallback(() => {
    if (isEmbed) {
      requestAccount()
    } else {
      openModal(ModalType.SelectWallet)
    }
  }, [isEmbed, requestAccount])
}
