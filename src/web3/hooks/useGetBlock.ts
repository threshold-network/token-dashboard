import { useCallback } from "react"
import { BlockTag } from "@ethersproject/abstract-provider"
import { Web3Provider } from "@ethersproject/providers"
import { useThreshold } from "../../contexts/ThresholdContext"
import { getProviderOrSigner } from "../../threshold-ts/utils"

export const useGetBlock = () => {
  const threshold = useThreshold()

  return useCallback(
    async (blockTag: BlockTag) => {
      const provider = getProviderOrSigner(
        threshold.config.ethereum.providerOrSigner as any
      ) as Web3Provider

      return provider.getBlock(blockTag)
    },
    [threshold]
  )
}
