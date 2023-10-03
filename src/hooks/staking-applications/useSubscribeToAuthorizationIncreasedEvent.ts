import {
  stakingApplicationsSlice,
  StakingAppName,
} from "../../store/staking-applications"
import {
  useSubscribeToContractEvent,
  useTStakingContract,
} from "../../web3/hooks"
import { useAppDispatch } from "../store"

export const useSubscribeToAuthorizationIncreasedEvent = (
  appName: StakingAppName
) => {
  const contract = useTStakingContract()
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
