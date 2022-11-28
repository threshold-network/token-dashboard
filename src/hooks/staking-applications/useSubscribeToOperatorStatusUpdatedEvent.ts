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
    async (stakingProvider: string) => {
      const txHash = ""
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
