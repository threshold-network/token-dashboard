import { useCallback } from "react"
import { isAddressZero } from "../../web3/utils"
import { useRegisterOperatorTransaction } from "./useRegisterOperatorTransaction"
import { useModal } from "../useModal"
import { ModalType } from "../../enums"
import { useOperatorMappedtoStakingProviderHelpers } from "./useOperatorMappedToStakingProviderHelpers"
import { useWeb3React } from "@web3-react/core"
import { OperatorMappedSuccessTx } from "../../components/Modal/MapOperatorToStakingProviderSuccessModal"

export const useRegisterMultipleOperatorsTransaction = () => {
  const { account } = useWeb3React()
  const { openModal } = useModal()

  const {
    sendTransaction: sendRegisterOperatorTransactionTbtc,
    status: registerOperatorTbtcStatus,
  } = useRegisterOperatorTransaction("tbtc")
  const {
    sendTransaction: sendRegisterOperatorTransactionRandomBeacon,
    status: registerOperatorRandomBeaconStatus,
  } = useRegisterOperatorTransaction("randomBeacon")

  const {
    operatorMappedRandomBeacon,
    operatorMappedTbtc,
    isOperatorMappedOnlyInRandomBeacon,
    isOperatorMappedOnlyInTbtc,
  } = useOperatorMappedtoStakingProviderHelpers()

  const registerMultipleOperators = useCallback(
    async (operator: string) => {
      try {
        if (!account) {
          throw new Error("Connect to the staking provider account first!")
        }
        if (
          !isAddressZero(operatorMappedRandomBeacon) &&
          !isAddressZero(operatorMappedTbtc)
        )
          throw new Error("Both apps already have mapped operator!")

        if (isOperatorMappedOnlyInRandomBeacon)
          throw new Error("Random beacon app already has mapped operator!")

        if (isOperatorMappedOnlyInTbtc)
          throw new Error("Tbtc app already have mapped operator!")

        // TODO: might also add a check if the operator is already used by another staking provider

        const successfullTxs: OperatorMappedSuccessTx[] = []
        const tbtcTx = await sendRegisterOperatorTransactionTbtc(operator)
        if (tbtcTx) {
          successfullTxs.push({
            application: {
              appName: "tbtc",
              operator: operator,
              stakingProvider: account,
            },
            txHash: tbtcTx.hash,
          })
        }
        const randomBeaconTx =
          await sendRegisterOperatorTransactionRandomBeacon(operator)
        if (randomBeaconTx) {
          successfullTxs.push({
            application: {
              appName: "randomBeacon",
              operator: operator,
              stakingProvider: account,
            },
            txHash: randomBeaconTx.hash,
          })
        }

        if (successfullTxs.length === 1) {
          openModal(ModalType.TransactionFailed, {
            error: new Error(
              "Transaction rejected. You are required to map the Operator Address for both apps."
            ),
          })
        }

        if (successfullTxs.length === 2) {
          openModal(ModalType.StakingApplicationsAuthorized, {
            transactions: successfullTxs,
          })
        }
      } catch (error) {
        openModal(ModalType.TransactionFailed, {
          error:
            (error as Error)?.message || "Error: Couldn't map operator address",
          isExpandableError: true,
        })
      }
    },
    [
      sendRegisterOperatorTransactionTbtc,
      sendRegisterOperatorTransactionRandomBeacon,
      openModal,
    ]
  )

  return {
    registerMultipleOperators,
    registerOperatorTbtcStatus,
    registerOperatorRandomBeaconStatus,
  }
}
