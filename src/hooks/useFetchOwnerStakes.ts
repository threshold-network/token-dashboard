import { useCallback } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import {
  useTStakingContract,
  T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
  useMulticallContract,
  usePREContract,
  useKeepTokenStakingContract,
} from "../web3/hooks"
import {
  getMulticallContractCall,
  getContractPastEvents,
  decodeMulticallResult,
  getAddress,
  isSameETHAddress,
} from "../web3/utils"
import { StakeType, Token } from "../enums"
import { StakeData } from "../types/staking"
import { setStakes } from "../store/staking"
import { useDispatch } from "react-redux"
import { useCheckBonusEligibility } from "./useCheckBonusEligibility"
import { useFetchPreConfigData } from "./useFetchPreConfigData"
import { useTConvertedAmount } from "./useTConvertedAmount"
import { useNuStakingEscrowContract } from "../web3/hooks/useNuStakingEscrowContract"

export const useFetchOwnerStakes = () => {
  const tStakingContract = useTStakingContract()

  const keepStakingContract = useKeepTokenStakingContract()
  const nuStakingEscrowContract = useNuStakingEscrowContract()

  const simplePREApplicationContract = usePREContract()

  const multicallContract = useMulticallContract()

  const checkBonusEligibility = useCheckBonusEligibility()

  const fetchPreConfigData = useFetchPreConfigData()

  const { convertToT: convertKeepToT } = useTConvertedAmount(Token.Keep, "0")
  const { convertToT: convertNuToT } = useTConvertedAmount(Token.Nu, "0")

  const dispatch = useDispatch()

  return useCallback(
    async (address?: string): Promise<StakeData[]> => {
      if (
        !tStakingContract ||
        !nuStakingEscrowContract ||
        !keepStakingContract ||
        !simplePREApplicationContract ||
        !multicallContract ||
        !address
      ) {
        dispatch(setStakes([]))
        return []
      }

      const stakedEvents = (
        await getContractPastEvents(tStakingContract, {
          eventName: "Staked",
          fromBlock: T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
          filterParams: [undefined, address],
        })
      ).reverse()

      const stakingProviders = stakedEvents.map(
        (_) => _.args?.stakingProvider as string
      )

      const stakingProviderEligibilityChecks = await checkBonusEligibility(
        stakingProviders
      )

      const preConfigData = await fetchPreConfigData(stakingProviders)

      const eligibleKeepStakeMulticalls = stakingProviders.map(
        (stakingProvider) => ({
          contract: keepStakingContract,
          method: "eligibleStake",
          args: [stakingProvider, tStakingContract.address],
        })
      )
      const eligibleKeepStakeRequests = eligibleKeepStakeMulticalls.map(
        getMulticallContractCall
      )

      const [, eligibleKeepStakesData] = await multicallContract?.aggregate(
        eligibleKeepStakeRequests
      )
      const eligibleKeepStakes = decodeMulticallResult(
        eligibleKeepStakesData,
        eligibleKeepStakeMulticalls
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
          bonusEligibility: stakingProviderEligibilityChecks[stakingProvider],
          preConfig: preConfigData[stakingProvider],
        } as StakeData
      })

      const multicalls = stakes.map((_) => ({
        contract: tStakingContract,
        method: "stakes",
        args: [_.stakingProvider],
      }))
      const multiCallsRequests = multicalls.map(getMulticallContractCall)

      const [, result] = await multicallContract?.aggregate(multiCallsRequests)
      const data = decodeMulticallResult(result, multicalls)

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
        const possibleNuTopUpInT = isSameETHAddress(
          stakingProvider,
          nuStakingProvider
        )
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
      multicallContract,
      dispatch,
      convertKeepToT,
      convertNuToT,
    ]
  )
}
