import { useWeb3React } from "@web3-react/core"
import { useCallback, useMemo } from "react"
import { useLedgerLiveApp } from "../contexts/LedgerLiveAppContext"
import { networks, toHex } from "../networks/utils"
import { useIsEmbed } from "./useIsEmbed"
import { AbstractConnector } from "../web3/connectors"

type UseIsActiveResult = {
  account: string | undefined
  chainId: number | undefined
  isActive: boolean
  connector: AbstractConnector | undefined
  deactivate: () => void
  switchNetwork: (chainId: number) => Promise<void>
}

/**
 * Checks if eth wallet is connected to the dashboard. It works with normal
 * view in the website and also inside Ledger Live App.
 * @return {UseIsActiveResult} Account address and `isActive` boolean
 */
export const useIsActive = (): UseIsActiveResult => {
  const {
    active: _active,
    account: _account,
    chainId: _chainId,
    connector: _connector,
    deactivate: _deactivate,
    activate: _activate,
  } = useWeb3React()
  const { ethAccount, ethAccountChainId, setEthAccount } = useLedgerLiveApp()
  const ledgerLiveAppEthAddress = ethAccount?.address || undefined
  const ledgerLiveAppEthChaindId = ethAccountChainId
  const { isEmbed } = useIsEmbed()

  const switchNetwork = useCallback(async (chainId: number): Promise<void> => {
    if (_connector) {
      const provider = await _connector.getProvider()
      const desiredChainIdHex = toHex(chainId)

      await provider
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: desiredChainIdHex }],
        })
        .catch(async (error: any) => {
          const errorCode =
            (error?.data as any)?.originalError?.code || error.code

          if (errorCode === 4902) {
            if (!provider) throw new Error("No provider")

            const network = networks.find((net) => net.chainId === chainId)
            if (!network || !network.chainParameters) {
              throw new Error("Network parameters not found")
            }

            // Add the chain to MetaMask
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  ...network.chainParameters,
                  chainId: desiredChainIdHex,
                },
              ],
            })

            // After adding, switch to the new chain
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: desiredChainIdHex }],
            })
          }
          throw error
        })
    }
  }, [])

  const isActive = useMemo(() => {
    if (isEmbed) {
      return !!ledgerLiveAppEthAddress
    }
    return !!_active && !!_account
  }, [ledgerLiveAppEthAddress, _active, _account, isEmbed])

  const deactivateLedgerLiveApp = useCallback(() => {
    setEthAccount(undefined)
  }, [setEthAccount])

  return {
    account: (isEmbed ? ledgerLiveAppEthAddress : _account) || undefined,
    chainId: isEmbed ? ledgerLiveAppEthChaindId : _chainId,
    isActive,
    connector: _connector,
    deactivate: isEmbed ? deactivateLedgerLiveApp : _deactivate,
    switchNetwork,
  }
}
