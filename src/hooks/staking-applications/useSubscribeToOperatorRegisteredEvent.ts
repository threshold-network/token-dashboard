import { useWeb3React } from "@web3-react/core"
import { operatorRegistered } from "../../store/account"
import { StakingAppName } from "../../store/staking-applications"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { isSameETHAddress } from "../../web3/utils"
import { useAppDispatch } from "../store"
import { useStakingAppContract } from "./useStakingAppContract"

type OperatorRegisteredEventCallback = (
  stakingProvider: string,
  operator: string
) => void

export const useSubscribeToOperatorRegisteredEvent = (
  appName: StakingAppName
) => {
  const contract = useStakingAppContract(appName)
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  useSubscribeToContractEvent<OperatorRegisteredEventCallback>(
    contract,
    "OperatorRegistered",
    async (stakingProvider, operator) => {
      if (account && isSameETHAddress(stakingProvider, account)) {
        dispatch(
          operatorRegistered({
            appName,
            operator,
          })
        )
      }
    },
    [account as string]
  )
}
