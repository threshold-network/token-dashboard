import { Event } from "@ethersproject/contracts"
import {
  stakingApplicationsSlice,
  StakingAppName,
} from "../../store/staking-applications"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useAppDispatch } from "../store"
import { useStakingAppContract } from "./useStakingAppContract"

export const useSubscribeToAuthorizationDecreaseApprovedEvent = (
  appName: StakingAppName
) => {
  const contract = useStakingAppContract(appName)
  const dispatch = useAppDispatch()

  useSubscribeToContractEvent(
    contract,
    "AuthorizationDecreaseApproved",
    // @ts-ignore
    async (stakingProvider: string, event: Event) => {
      dispatch(
        stakingApplicationsSlice.actions.authorizationDecreaseApproved({
          stakingProvider,
          appName,
          txHash: event.transactionHash,
        })
      )
    }
  )
}
