import React, { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import { WalletConnectionModalBase } from "./components"
import { ConnectionError } from "../../../enums"
import coinbaseConnector from "../../../web3/connectors/coinbaseWallet"
import CoinbaseStatusAlert from "./components/CoinbaseStatusAlert"
import { CoinbaseWallet } from "../../../static/icons/CoinbaseWallet"
import doesErrorInclude from "../../../web3/utils/doesErrorInclude"

const ConnectCoinbase: FC<{ goBack: () => void; closeModal: () => void }> = ({
  goBack,
  closeModal,
}) => {
  const { activate, error } = useWeb3React()

  const connectionRejected = doesErrorInclude(
    error,
    ConnectionError.RejectedCoinbaseConnection
  )

  const unsupportedChainId = doesErrorInclude(
    error,
    ConnectionError.CoinbaseUnsupportedNetwork
  )

  return (
    <WalletConnectionModalBase
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={CoinbaseWallet}
      title="Coinbase Wallet"
      subTitle="The coinbase extension will open in an external window."
      tryAgain={
        connectionRejected ? () => activate(coinbaseConnector) : undefined
      }
    >
      <CoinbaseStatusAlert
        connectionRejected={connectionRejected}
        unsupportedChainId={unsupportedChainId}
      />
    </WalletConnectionModalBase>
  )
}

export default ConnectCoinbase
