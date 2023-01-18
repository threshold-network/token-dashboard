import { useCallback } from "react"
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
          const receipt = await sendTransaction(
            stakingProvider,
            stakingApp.address,
            stakingApp.amount
          )
          if (receipt) {
            successfullTxs.push({
              ...stakingApp,
              txHash: receipt.transactionHash,
            })
          }
        }
        if (successfullTxs.length > 0) {
          openModal(ModalType.StakingApplicationsAuthorized, {
            stakingProvider,
            authorizedStakingApplications: successfullTxs,
          })
        }
      } catch (error) {
        openModal(ModalType.TransactionFailed, {
          error:
            (error as Error)?.message ||
            new Error("Error: Couldn't authorize applications"),
          isExpandableError: true,
        })
      }
    },
    [sendTransaction, randomBeaconAppAddress, tbtcAppAddress, openModal]
  )

  return { authorizeMultipleApps, status }
}
