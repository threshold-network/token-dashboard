import { useCallback } from "react"
import { useBondOperatorTransaction } from "./useBondOperatorTransaction"
import { useRegisterOperatorTransaction } from "./useRegisterOperatorTransaction"
import { useModal } from "../useModal"
import { ModalType } from "../../enums"
import { useWeb3React } from "@web3-react/core"
import { OperatorMappedSuccessTx } from "../../components/Modal/MapOperatorToStakingProviderSuccessModal"
import { mapOperatorToStakingProviderModalClosed } from "../../store/modal"
import { useAppDispatch, useAppSelector } from "../store"
import { selectMappedOperators } from "../../store/account"
import { isEmptyOrZeroAddress } from "../../web3/utils"

export const useRegisterMultipleOperatorsTransaction = () => {
  const {
    mappedOperatorTbtc,
    mappedOperatorRandomBeacon,
    mappedOperatorTaco,
    isOperatorMappedInAllApps,
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
  const {
    sendTransaction: sendRegisterOperatorTransactionTaco,
    status: registerOperatorTacoStatus,
  } = useBondOperatorTransaction("taco")

  const registerMultipleOperators = useCallback(
    async (operator: string) => {
      try {
        if (!account) {
          throw new Error("Connect to the staking provider account first!")
        }

        if (isOperatorMappedInAllApps)
          throw new Error("All apps already have mapped operator!")

        if (!isEmptyOrZeroAddress(mappedOperatorRandomBeacon))
          throw new Error("Random beacon app already has mapped operator!")

        if (!isEmptyOrZeroAddress(mappedOperatorTbtc))
          throw new Error("Tbtc app already has mapped operator!")

        if (!isEmptyOrZeroAddress(mappedOperatorTaco))
          throw new Error("TACo app already has mapped operator!")

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
        const tacoReceipt = await sendRegisterOperatorTransactionTaco(
          account,
          operator
        )
        if (tacoReceipt) {
          successfullTxs.push({
            application: {
              appName: "taco",
              operator: operator,
              stakingProvider: account,
            },
            txHash: tacoReceipt.transactionHash,
          })
        }

        if (successfullTxs.length < 3) {
          openModal(ModalType.TransactionFailed, {
            error: new Error(
              "Transaction rejected. You are required to map the Operator Address for all apps."
            ),
            closeModal: () => {
              closeModal()
              dispatch(mapOperatorToStakingProviderModalClosed())
            },
          })
        }

        if (successfullTxs.length === 3) {
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
      mappedOperatorTaco,
      sendRegisterOperatorTransactionTbtc,
      sendRegisterOperatorTransactionRandomBeacon,
      sendRegisterOperatorTransactionTaco,
      openModal,
    ]
  )

  return {
    registerMultipleOperators,
    registerOperatorTbtcStatus,
    registerOperatorRandomBeaconStatus,
    registerOperatorTacoStatus,
  }
}
