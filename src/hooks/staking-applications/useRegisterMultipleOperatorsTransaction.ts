import { useCallback } from "react"
import { useRegisterOperatorTransaction } from "./useRegisterOperatorTransaction"
import { useModal } from "../useModal"
import { ModalType } from "../../enums"
import { useWeb3React } from "@web3-react/core"
import { OperatorMappedSuccessTx } from "../../components/Modal/MapOperatorToStakingProviderSuccessModal"
import { mapOperatorToStakingProviderModalClosed } from "../../store/modal"
import { useAppDispatch, useAppSelector } from "../store"
import { selectMappedOperators } from "../../store/account"

export const useRegisterMultipleOperatorsTransaction = () => {
  const {
    mappedOperatorTbtc,
    mappedOperatorRandomBeacon,
    isOperatorMappedInBothApps,
    isOperatorMappedOnlyInRandomBeacon,
    isOperatorMappedOnlyInTbtc,
  } = useAppSelector((state) => selectMappedOperators(state))
  const { account } = useWeb3React()
  const { openModal, closeModal } = useModal()
  const dispatch = useAppDispatch()

  const {
    sendTransaction: sendRegisterOperatorTransactionTbtc,
    status: registerOperatorTbtcStatus,
  } = useRegisterOperatorTransaction("tbtc")
  const {
    sendTransaction: sendRegisterOperatorTransactionRandomBeacon,
    status: registerOperatorRandomBeaconStatus,
  } = useRegisterOperatorTransaction("randomBeacon")

  const registerMultipleOperators = useCallback(
    async (operator: string) => {
      try {
        if (!account) {
          throw new Error("Connect to the staking provider account first!")
        }

        if (isOperatorMappedInBothApps)
          throw new Error("Both apps already have mapped operator!")

        if (isOperatorMappedOnlyInRandomBeacon)
          throw new Error("Random beacon app already has mapped operator!")

        if (isOperatorMappedOnlyInTbtc)
          throw new Error("Tbtc app already have mapped operator!")

        // TODO: might also add a check if the operator is already used by another staking provider

        const successfullTxs: OperatorMappedSuccessTx[] = []
        const tbtcReceipt = await sendRegisterOperatorTransactionTbtc(operator)
        if (tbtcReceipt) {
          successfullTxs.push({
            application: {
              appName: "tbtc",
              operator: operator,
              stakingProvider: account,
            },
            txHash: tbtcReceipt.transactionHash,
          })
        }
        const randomBeaconReceipt =
          await sendRegisterOperatorTransactionRandomBeacon(operator)
        if (randomBeaconReceipt) {
          successfullTxs.push({
            application: {
              appName: "randomBeacon",
              operator: operator,
              stakingProvider: account,
            },
            txHash: randomBeaconReceipt.transactionHash,
          })
        }

        if (successfullTxs.length < 2) {
          openModal(ModalType.TransactionFailed, {
            error: new Error(
              "Transaction rejected. You are required to map the Operator Address for both apps."
            ),
            closeModal: () => {
              closeModal()
              dispatch(mapOperatorToStakingProviderModalClosed())
            },
          })
        }

        if (successfullTxs.length === 2) {
          openModal(ModalType.MapOperatorToStakingProviderSuccess, {
            transactions: successfullTxs,
          })
        }
      } catch (error) {
        openModal(ModalType.TransactionFailed, {
          error:
            (error as Error)?.message ||
            new Error("Error: Couldn't map operator address"),
          isExpandableError: true,
          closeModal: () => {
            closeModal()
            dispatch(mapOperatorToStakingProviderModalClosed())
          },
        })
      }
    },
    [
      account,
      mappedOperatorRandomBeacon,
      mappedOperatorTbtc,
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
