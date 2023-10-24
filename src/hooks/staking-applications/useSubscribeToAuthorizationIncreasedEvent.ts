import { stakingApplicationsSlice } from "../../store/staking-applications"
import { getStakingAppNameFromAppAddress } from "../../utils/getStakingAppLabel"
import {
  useSubscribeToContractEvent,
  useTStakingContract,
} from "../../web3/hooks"
import { useAppDispatch } from "../store"

export const useSubscribeToAuthorizationIncreasedEvent = () => {
  const contract = useTStakingContract()
  const dispatch = useAppDispatch()

  useSubscribeToContractEvent(
    contract,
    "AuthorizationIncreased",
    // @ts-ignore
    async (stakingProvider, application, fromAmount, toAmount) => {
      const appName = getStakingAppNameFromAppAddress(application)

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
