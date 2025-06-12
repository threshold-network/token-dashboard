import { BitcoinAddressConverter } from "@keep-network/tbtc-v2.ts"
import { TaskAbortError } from "@reduxjs/toolkit"
import {
  getChainIdentifier,
  isPublicKeyHashTypeAddress,
} from "../../threshold-ts/utils"
import { MintingStep } from "../../types/tbtc"
import { ONE_SEC_IN_MILISECONDS } from "../../utils/date"
import { isAddress, isAddressZero } from "../../web3/utils"
import { AppListenerEffectAPI } from "../listener"
import { tbtcSlice } from "./tbtcSlice"
import {
  getChainIdToNetworkName,
  isL1Network,
  isSameChainId,
} from "../../networks/utils"
import { ChainRegistry } from "../../chains/ChainRegistry"
import { ChainType } from "../../types/chain"

export const fetchBridgeactivityEffect = async (
  action: ReturnType<typeof tbtcSlice.actions.requestBridgeActivity>,
  listenerApi: AppListenerEffectAPI
) => {
  const { account } = listenerApi.getState()
  const { depositor } = action.payload

  // Check if it's a StarkNet address (starts with 0x and is 64 chars long)
  const isStarkNetAddress =
    depositor?.startsWith("0x") && depositor.length === 66

  if (!isStarkNetAddress) {
    // For EVM addresses, validate normally
    if (
      !isAddress(depositor) ||
      isAddressZero(depositor) ||
      !account.chainId ||
      !isSameChainId(
        account.chainId,
        listenerApi.extra.threshold.config.ethereum.chainId
      )
    )
      return
  } else {
    // For StarkNet addresses, skip chain ID validation since StarkNet uses different chain IDs
    if (!depositor || isAddressZero(depositor)) {
      return
    }
  }

  listenerApi.unsubscribe()

  listenerApi.dispatch(tbtcSlice.actions.fetchingBridgeActivity())

  try {
    const data = await listenerApi.extra.threshold.tbtc.getBridgeActivity(
      depositor
    )
    listenerApi.dispatch(tbtcSlice.actions.bridgeActivityFetched(data))
  } catch (error) {
    console.error("Could not fetch bridge activity: ", error)
    listenerApi.subscribe()
    listenerApi.dispatch(
      tbtcSlice.actions.bridgeActivityFailed({
        error: "Could not fetch bridge activity.",
      })
    )
  } finally {
    listenerApi.subscribe()
  }
}

export const findUtxoEffect = async (
  action: ReturnType<typeof tbtcSlice.actions.findUtxo>,
  listenerApi: AppListenerEffectAPI
) => {
  const { btcDepositAddress, chainId } = action.payload

  const {
    tbtc: {
      depositor,
      blindingFactor,
      walletPublicKeyHash,
      refundLocktime,
      btcRecoveryAddress,
      chainName,
      extraData,
    },
  } = listenerApi.getState()

  // For StarkNet deposits, depositor might be a StarkNet address
  // which won't pass the Ethereum address check
  const isStarkNetDeposit = chainName?.toLowerCase() === "starknet"

  if (
    !btcDepositAddress ||
    (!isStarkNetDeposit && !isAddress(depositor) && !isAddressZero(depositor))
  ) {
    return
  }

  // Cancel any in-progress instances of this listener.
  listenerApi.cancelActiveListeners()

  const pollingTask = listenerApi.fork(async (forkApi) => {
    try {
      while (true) {
        // Use chain registry for validation
        const chainRegistry = ChainRegistry.getInstance()
        const chain = chainRegistry.getChain(chainId, chainName)

        if (!chain) {
          // For StarkNet chains, check if they're disabled
          if (chainName?.toLowerCase() === "starknet") {
            console.error("StarkNet network is disabled:", {
              chainId,
              chainName,
              message: "Cannot process deposits on disabled StarkNet network",
            })
            throw new Error(
              "The connected StarkNet network is not enabled. Please switch to a supported network."
            )
          }

          // Legacy validation for backward compatibility (EVM chains)
          if (getChainIdToNetworkName(chainId) !== chainName) {
            console.error("Chain mismatch:", {
              chainId,
              chainName,
              expected: getChainIdToNetworkName(chainId),
            })
            throw new Error("Chain ID and deposit chain name mismatch")
          }
        } else {
          // For StarkNet, we use the proxy chain ID for validation
          if (chain.getType() === ChainType.STARKNET) {
            chainRegistry.getEffectiveChainId(chainId, chainName)
          }
        }
        // Initiating deposit from redux store (if deposit object is empty)
        if (!listenerApi.extra.threshold.tbtc.deposit) {
          const bitcoinNetwork = listenerApi.extra.threshold.tbtc.bitcoinNetwork

          if (!isPublicKeyHashTypeAddress(btcRecoveryAddress, bitcoinNetwork)) {
            throw new Error("Bitcoin recovery address must be P2PKH or P2WPKH")
          }

          const refundPublicKeyHash =
            BitcoinAddressConverter.addressToPublicKeyHash(
              btcRecoveryAddress,
              bitcoinNetwork
            ).toString()
          // For StarkNet deposits, we need to handle the depositor differently
          // since StarkNet addresses can't be converted to EthereumAddress objects
          const isStarkNetDeposit = chainName?.toLowerCase() === "starknet"

          if (isStarkNetDeposit) {
            // For StarkNet, we need to restore the deposit from saved parameters

            // For StarkNet deposits, we need to check if the cross-chain contracts are initialized
            // If not, we'll skip restoration here and let the UI handle it when the wallet connects
            const { threshold: thresholdContext } = listenerApi.extra
            const isStarkNetInitialized =
              await thresholdContext.tbtc.isStarkNetInitialized()
            if (!isStarkNetInitialized) {
              // Don't throw error, just skip - the UI will handle restoration when wallet connects
              return
            }

            try {
              // For StarkNet, we need to use undefined as chainId to trigger the StarkNet-specific path
              // This will use the already initialized StarkNet cross-chain setup
              await forkApi.pause(
                listenerApi.extra.threshold.tbtc.initiateCrossChainDepositFromScriptParameters(
                  {
                    depositor: getChainIdentifier(depositor), // This is safe - it's an Ethereum format address
                    blindingFactor,
                    walletPublicKeyHash,
                    refundPublicKeyHash,
                    refundLocktime,
                    extraData, // Contains the encoded StarkNet address
                  },
                  undefined // StarkNet doesn't use Ethereum chain ID
                )
              )
            } catch (error) {
              console.error("Failed to restore StarkNet deposit:", error)
              throw error
            }
          } else {
            // For EVM chains, proceed with standard deposit initialization
            const depositParams = {
              depositor: getChainIdentifier(depositor),
              blindingFactor,
              walletPublicKeyHash,
              refundPublicKeyHash,
              refundLocktime,
            }

            if (isL1Network(chainId)) {
              await forkApi.pause(
                listenerApi.extra.threshold.tbtc.initiateDepositFromDepositScriptParameters(
                  depositParams
                )
              )
            } else {
              await forkApi.pause(
                listenerApi.extra.threshold.tbtc.initiateCrossChainDepositFromScriptParameters(
                  {
                    ...depositParams,
                    extraData,
                  },
                  chainId
                )
              )
            }
          }
        }

        // Looking for utxo.
        const utxos = await forkApi.pause(
          listenerApi.extra.threshold.tbtc.findAllUnspentTransactionOutputs()
        )

        if (!utxos || utxos.length === 0) {
          // Bitcoin deposit address exists and there is no utxo for a given
          // deposit address- this means someone wants to use this deposit
          // address to mint tBTC. Redirect to step 2 and continue searching for
          // utxo.
          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "mintingStep",
              value: MintingStep.Deposit,
            })
          )
          await forkApi.delay(10 * ONE_SEC_IN_MILISECONDS)
          continue
        }

        let utxo = utxos[0]
        let areAllDepositRevealed = true

        // We have to find the first UTXO that is not revealed. The UTXOs
        // returned from `findAllUnspentTransactionOutputs` are in reversed
        // order so we have to start our search from the last element of the
        // `utxos` so that we search them in the order they were done. We go
        // through all of them up to the first one to find the oldest UTXO that
        // is not revealed.
        // If all deposits are revealed then we just use the first UTXO (which
        // should be the most recent transaction).
        for (let i = utxos.length - 1; i >= 0; i--) {
          // Check if deposit is revealed.
          const deposit = await forkApi.pause(
            listenerApi.extra.threshold.tbtc.getRevealedDeposit(utxos[i])
          )
          const isDepositRevealed = deposit.revealedAt !== 0

          if (!isDepositRevealed) {
            utxo = utxos[i]
            areAllDepositRevealed = false
            break
          }
        }

        listenerApi.dispatch(
          tbtcSlice.actions.updateState({
            key: "utxo",
            value: {
              ...utxo,
              transactionHash: utxo.transactionHash.toString(),
              value: utxo.value.toString(),
            },
          })
        )

        if (areAllDepositRevealed) {
          // All deposits are already revealed. Force start from step 1 and
          // remove deposit data.
          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "mintingStep",
              value: MintingStep.MintingSuccess,
            })
          )
        } else {
          // UTXO exists for a given Bitcoin deposit address and deposit is not
          // yet revealed. Redirect to step 3 to reveal the deposit and set
          // utxo.
          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "mintingStep",
              value: MintingStep.InitiateMinting,
            })
          )
        }
      }
    } catch (err) {
      if (!(err instanceof TaskAbortError)) {
        console.error(`Failed to fetch utxo for ${btcDepositAddress}.`, err)
      }
    }
  })

  await listenerApi.condition((action) => {
    if (!tbtcSlice.actions.updateState.match(action)) return false

    const { key, value } = (
      action as ReturnType<typeof tbtcSlice.actions.updateState>
    ).payload
    return key === "mintingStep" && value !== MintingStep.Deposit
  })

  // Stop polling task.
  pollingTask.cancel()
}

export const fetchUtxoConfirmationsEffect = async (
  action: ReturnType<typeof tbtcSlice.actions.fetchUtxoConfirmations>,
  listenerApi: AppListenerEffectAPI
) => {
  const { utxo } = action.payload
  const {
    tbtc: { txConfirmations },
  } = listenerApi.getState()

  if (!utxo) return

  const minimumNumberOfConfirmationsNeeded =
    listenerApi.extra.threshold.tbtc.minimumNumberOfConfirmationsNeeded(
      utxo.value
    )

  if (txConfirmations && txConfirmations >= minimumNumberOfConfirmationsNeeded)
    return

  // Cancel any in-progress instances of this listener.
  listenerApi.cancelActiveListeners()

  const pollingTask = listenerApi.fork(async (forkApi) => {
    try {
      while (true) {
        // Get confirmations
        try {
          const confirmations = await forkApi.pause(
            listenerApi.extra.threshold.tbtc.getTransactionConfirmations(
              utxo.transactionHash
            )
          )
          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "txConfirmations",
              value: confirmations,
            })
          )
        } catch (error) {
          // Log the error but continue polling
          console.warn(
            `Failed to get confirmations for ${utxo.transactionHash}, will retry:`,
            error
          )
        }
        await forkApi.delay(10 * ONE_SEC_IN_MILISECONDS)
      }
    } catch (err) {
      if (!(err instanceof TaskAbortError)) {
        console.error(
          `Failed to sync confirmation for transaction: ${utxo.transactionHash}.`,
          err
        )
      }
    }
  })

  await listenerApi.condition((action) => {
    if (!tbtcSlice.actions.updateState.match(action)) return false

    const { key, value } = (
      action as ReturnType<typeof tbtcSlice.actions.updateState>
    ).payload
    return (
      key === "txConfirmations" && value >= minimumNumberOfConfirmationsNeeded
    )
  })

  // Stop polling task.
  pollingTask.cancel()
}
