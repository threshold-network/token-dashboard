import {
  stakingApplicationsSlice,
  StakingAppName,
} from "../../store/staking-applications"
import { threshold } from "../../utils/getThresholdLib"
import {
  useSubscribeToContractEvent,
  useTStakingContract,
} from "../../web3/hooks"
import { useAppDispatch } from "../store"

const getApplicationName = (address: string) => {
  const { multiAppStaking } = threshold
  const namesDictionary = Object.fromEntries(
    Object.entries(multiAppStaking).map(([name, { address }]) => [
      address,
      name === "ecdsa" ? "tbtc" : name,
    ])
  )
  return namesDictionary[address]
}

export const useSubscribeToAuthorizationIncreasedEvent = () => {
  const contract = useTStakingContract()
  const dispatch = useAppDispatch()

  useSubscribeToContractEvent(
    contract,
    "AuthorizationIncreased",
    // @ts-ignore
    async (stakingProvider, application, fromAmount, toAmount) => {
      const appName = getApplicationName(application)

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
