import { Event } from "ethers"
import {
  stakingApplicationsSlice,
  StakingAppName,
} from "../../store/staking-applications"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useAppDispatch } from "../store"
import { useStakingAppContract } from "./useStakingAppContract"

export const useSubscribeToOperatorStatusUpdatedEvent = (
  appName: StakingAppName
) => {
  const contract = useStakingAppContract(appName)
  const dispatch = useAppDispatch()

  useSubscribeToContractEvent(
    contract,
    "OperatorStatusUpdated",
    // @ts-ignore
    async (stakingProvider: string, operator: string, event: Event) => {
      const txHash = event.transactionHash
      dispatch(
        stakingApplicationsSlice.actions.operatorStatusUpdated({
          stakingProvider,
          appName,
          txHash,
        })
      )
    }
  )
}
