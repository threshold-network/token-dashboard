import { useCallback } from "react"
import { ContractTransaction } from "ethers"
import { useThreshold } from "../../contexts/ThresholdContext"
import { useSendTransactionFromFn } from "../../web3/hooks"
import { isSameETHAddress } from "../../web3/utils"
import { useStakingApplicationAddress } from "./useStakingApplicationAddress"
import { useModal } from "../useModal"
import { ModalType } from "../../enums"

export const useAuthorizeMultipleAppsTransaction = () => {
  const threshold = useThreshold()
  const tbtcAppAddress = useStakingApplicationAddress("tbtc")
  const randomBeaconAppAddress = useStakingApplicationAddress("randomBeacon")
  const { openModal } = useModal()

  const { sendTransaction, status } = useSendTransactionFromFn(
    threshold.staking.increaseAuthorization
  )

  const authorizeMultipleApps = useCallback(
    async (
      applications: {
        address: string
        amount: string
      }[],
      stakingProvider: string
    ) => {
      try {
        if (applications.length === 0)
          throw new Error("No staking applications to authorize.")

        const includesOnlySupportedApps = applications.every(
          (_) =>
            isSameETHAddress(_.address, tbtcAppAddress) ||
            isSameETHAddress(_.address, randomBeaconAppAddress)
        )

        if (!includesOnlySupportedApps)
          throw new Error("Unsupported staking applications detected.")

        const successfullTxs: {
          address: string
          txHash: string
          amount: string
        }[] = []
        for (const stakingApp of applications) {
          const tx = await sendTransaction(
            stakingProvider,
            stakingApp.address,
            stakingApp.amount
          )
          if (tx) {
            successfullTxs.push({ ...stakingApp, txHash: tx.hash })
          }
        }
        openModal(ModalType.StakingApplicationsAuthorized, {
          stakingProvider,
          transactions: successfullTxs,
        })
      } catch (error) {
        openModal(ModalType.TransactionFailed, {
          error,
          isExpandableError: true,
        })
      }
    },
    [sendTransaction, randomBeaconAppAddress, tbtcAppAddress, openModal]
  )

  return { authorizeMultipleApps, status }
}
