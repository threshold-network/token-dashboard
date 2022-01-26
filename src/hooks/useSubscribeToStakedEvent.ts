import { useWeb3React } from "@web3-react/core"
import { useDispatch } from "react-redux"
import { Event } from "@ethersproject/contracts"
import { BigNumberish } from "@ethersproject/bignumber"
import { operatorStaked } from "../store/staking"
import { useSubscribeToContractEvent, useTStakingContract } from "../web3/hooks"

export const useSubscribeToStakedEvent = () => {
  const tStakingContract = useTStakingContract()
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useSubscribeToContractEvent(
    tStakingContract!,
    "Staked",
    // TODO: figure out how to type callback.
    // @ts-ignore
    (
      stakeType: number,
      owner: string,
      stakingProvider: string,
      beneficiary: string,
      authorizer: string,
      amount: BigNumberish,
      event: Event
    ) => {
      // TODO: open success modal here
      const { blockNumber, blockHash, transactionHash } = event
      dispatch(
        operatorStaked({
          stakeType,
          owner,
          stakingProvider,
          authorizer,
          beneficiary,
          blockHash,
          blockNumber,
          transactionHash,
          amount: amount.toString(),
        })
      )
    },
    [null, account]
  )
}
