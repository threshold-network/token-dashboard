import { useCallback } from "react"
import { isAddressZero } from "../../web3/utils"
import { useRegisterOperatorTransaction } from "./useRegisterOperatorTransaction"
import { useModal } from "../useModal"
import { ModalType } from "../../enums"
import { useWeb3React } from "@web3-react/core"
import { OperatorMappedSuccessTx } from "../../components/Modal/MapOperatorToStakingProviderSuccessModal"
import { mapOperatorToStakingProviderModalClosed } from "../../store/modalQueue"
import { useDispatch } from "react-redux"
import { useThreshold } from "../../contexts/ThresholdContext"

export const useRegisterMultipleOperatorsTransaction = () => {
  const { account } = useWeb3React()
  const { openModal, closeModal } = useModal()
  const dispatch = useDispatch()
  const threshold = useThreshold()

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
        const {
          tbtc: mappedOperatorTbtc,
          randomBeacon: mappedOperatorRandomBeacon,
        } = await threshold.multiAppStaking.getMappedOperatorsForStakingProvider(
          account
        )
        if (
          !isAddressZero(mappedOperatorRandomBeacon) &&
          !isAddressZero(mappedOperatorTbtc)
        )
          throw new Error("Both apps already have mapped operator!")

        const isOperatorMappedOnlyInTbtc =
          !isAddressZero(mappedOperatorTbtc) &&
          isAddressZero(mappedOperatorRandomBeacon)

        const isOperatorMappedOnlyInRandomBeacon =
          isAddressZero(mappedOperatorTbtc) &&
          !isAddressZero(mappedOperatorRandomBeacon)

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
          openModal(ModalType.StakingApplicationsAuthorized, {
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
