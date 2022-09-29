import { useCallback } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import {
  useTStakingContract,
  T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
  usePREContract,
  useKeepTokenStakingContract,
} from "../web3/hooks"
import {
  getContractPastEvents,
  getAddress,
  isSameETHAddress,
  isAddress,
} from "../web3/utils"
import { StakeType, Token } from "../enums"
import { StakeData } from "../types/staking"
import { setStakes } from "../store/staking"
import { useDispatch } from "react-redux"
import { useFetchPreConfigData } from "./useFetchPreConfigData"
import { useTConvertedAmount } from "./useTConvertedAmount"
import { useNuStakingEscrowContract } from "../web3/hooks/useNuStakingEscrowContract"
import { useThreshold } from "../contexts/ThresholdContext"

export const useFetchOwnerStakes = () => {
  const tStakingContract = useTStakingContract()

  const keepStakingContract = useKeepTokenStakingContract()
  const nuStakingEscrowContract = useNuStakingEscrowContract()

  const simplePREApplicationContract = usePREContract()

  const fetchPreConfigData = useFetchPreConfigData()

  const { convertToT: convertKeepToT } = useTConvertedAmount(Token.Keep, "0")
  const { convertToT: convertNuToT } = useTConvertedAmount(Token.Nu, "0")

  const dispatch = useDispatch()
  const threshold = useThreshold()

  return useCallback(
    async (address?: string): Promise<StakeData[]> => {
      if (
        !tStakingContract ||
        !nuStakingEscrowContract ||
        !keepStakingContract ||
        !simplePREApplicationContract ||
        !address
      ) {
        return []
      }

      const stakedEvents = (
        await getContractPastEvents(tStakingContract, {
          eventName: "Staked",
          fromBlock: T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
          filterParams: [undefined, address],
        })
      ).reverse()

      const stakingProviderToBeneficiary = stakedEvents.reduce(
        (reducer, event): { [stakingProvider: string]: string } => {
          reducer[event.args?.stakingProvider as string] = event.args
            ?.beneficiary as string
          return reducer
        },
        {} as { [stakingProvider: string]: string }
      )

      const stakingProviders = Object.keys(stakingProviderToBeneficiary)

      const preConfigData = await fetchPreConfigData(stakingProviders)

      const eligibleKeepStakes = await threshold.multicall.aggregate(
        stakingProviders.map((stakingProvider) => ({
          interface: keepStakingContract.interface,
          address: keepStakingContract.address,
          method: "eligibleStake",
          args: [stakingProvider, tStakingContract.address],
        }))
      )

      // The NU staker can have only one stake.
      const { stakingProvider: nuStakingProvider, value: nuStake } =
        await nuStakingEscrowContract.stakerInfo(address)

      const stakes = stakedEvents.map((_) => {
        const amount = _.args?.amount.toString()
        const stakeType = _.args?.stakeType as StakeType
        const stakingProvider = getAddress(_.args?.stakingProvider as string)

        return {
          stakeType,
          owner: _.args?.owner as string,
          stakingProvider,
          beneficiary: _.args?.beneficiary as string,
          authorizer: _.args?.authorizer as string,
          blockNumber: _.blockNumber,
          blockHash: _.blockHash,
          transactionHash: _.transactionHash,
          nuInTStake: stakeType === StakeType.NU ? amount : "0",
          keepInTStake: stakeType === StakeType.KEEP ? amount : "0",
          tStake: stakeType === StakeType.T ? amount : "0",
          preConfig: preConfigData[stakingProvider],
        } as StakeData
      })

      const data = await threshold.multicall.aggregate(
        stakes.map((_) => ({
          interface: tStakingContract.interface,
          address: tStakingContract.address,
          method: "stakes",
          args: [_.stakingProvider],
        }))
      )

      data.forEach((_, index) => {
        const total = BigNumber.from(_.tStake)
          .add(BigNumber.from(_.keepInTStake))
          .add(BigNumber.from(_.nuInTStake))
        const keepInTStake = _.keepInTStake.toString()
        const keepEligableStakeInT = convertKeepToT(
          eligibleKeepStakes[index].toString()
        )
        const possibleKeepTopUpInT = BigNumber.from(keepEligableStakeInT)
          .sub(BigNumber.from(keepInTStake))
          .toString()

        const stakingProvider = stakes[index].stakingProvider
        const nuInTStake = stakes[index].nuInTStake.toString()

        const possibleNuTopUpInT =
          isAddress(nuStakingProvider) &&
          isSameETHAddress(stakingProvider, nuStakingProvider)
            ? BigNumber.from(convertNuToT(nuStake))
                .sub(BigNumber.from(nuInTStake))
                .toString()
            : "0"

        stakes[index] = {
          ...stakes[index],
          tStake: _.tStake.toString(),
          keepInTStake,
          nuInTStake,
          totalInTStake: total.toString(),
          possibleKeepTopUpInT,
          possibleNuTopUpInT,
        }
      })

      dispatch(setStakes(stakes))

      return stakes
    },
    [
      tStakingContract,
      dispatch,
      convertKeepToT,
      convertNuToT,
      fetchPreConfigData,
      threshold,
    ]
  )
}
