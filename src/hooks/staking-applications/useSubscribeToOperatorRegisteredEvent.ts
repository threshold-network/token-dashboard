import { operatorRegistered } from "../../store/account"
import { StakingAppName } from "../../store/staking-applications"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { isSameETHAddress } from "../../web3/utils"
import { useAppDispatch } from "../store"
import { useIsActive } from "../useIsActive"
import { useStakingAppContract } from "./useStakingAppContract"

export const useSubscribeToOperatorRegisteredEvent = (
  appName: StakingAppName
) => {
  const contract = useStakingAppContract(appName)
  const dispatch = useAppDispatch()
  const { account } = useIsActive()

  useSubscribeToContractEvent(
    contract,
    "OperatorRegistered",
    //@ts-ignore
    async (stakingProvider: string, operator: string) => {
      if (account && isSameETHAddress(stakingProvider, account)) {
        dispatch(
          operatorRegistered({
            appName,
            operator,
          })
        )
      }
    },
    [account]
  )
}
