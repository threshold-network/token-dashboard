import { useCallback } from "react"
import { usePREContract } from "../web3/hooks"
import { PreConfigData } from "../types/staking"
import { useThreshold } from "../contexts/ThresholdContext"

export const useFetchPreConfigData = (): ((
  stakingProviders: string[]
) => Promise<PreConfigData>) => {
  const preContract = usePREContract()
  const threshold = useThreshold()

  return useCallback(
    async (stakingProviders) => {
      if (!stakingProviders || stakingProviders.length === 0 || !preContract) {
        return {} as PreConfigData
      }

      const preConfigDataRaw = await threshold.multicall.aggregate(
        stakingProviders.map((stakingProvider) => {
          return {
            interface: preContract.interface,
            address: preContract.address,
            method: "stakingProviderInfo",
            args: [stakingProvider],
          }
        })
      )

      return preConfigDataRaw.reduce(
        (finalData: PreConfigData, _, idx): PreConfigData => {
          finalData[stakingProviders[idx]] = {
            operator: _.operator,
            isOperatorConfirmed: _.operatorConfirmed,
            operatorStartTimestamp: _.operatorStartTimestamp.toString(),
          }
          return finalData
        },
        {}
      )
    },
    [preContract, threshold]
  )
}
