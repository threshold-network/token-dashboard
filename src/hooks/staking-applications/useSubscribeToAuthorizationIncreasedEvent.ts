import {
  stakingApplicationsSlice,
  StakingAppName,
} from "../../store/staking-applications"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useAppDispatch } from "../store"
import { useStakingAppContract } from "./useStakingAppContract"

export const useSubscribeToAuthorizationIncreasedEvent = (
  appName: StakingAppName
) => {
  const contract = useStakingAppContract(appName)
  const dispatch = useAppDispatch()

  useSubscribeToContractEvent(
    contract,
    "AuthorizationIncreased",
    // @ts-ignore
    async (stakingProvider, operator, fromAmount, toAmount) => {
      dispatch(
        stakingApplicationsSlice.actions.authorizationIncreased({
          stakingProvider,
          toAmount: toAmount.toString(),
          appName,
        })
      )
    }
  )
}
