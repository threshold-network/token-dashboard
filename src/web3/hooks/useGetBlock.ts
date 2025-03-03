import { useCallback } from "react"
import { BlockTag } from "@ethersproject/abstract-provider"
import { Web3Provider } from "@ethersproject/providers"
import { useThreshold } from "../../contexts/ThresholdContext"
import { getProviderOrSigner } from "../../threshold-ts/utils"
import { LedgerLiveSigner } from "../../utils/ledger"

export const useGetBlock = () => {
  const threshold = useThreshold()
  const providerOrSigner = threshold.config.ethereum.providerOrSigner

  return useCallback(
    async (blockTag: BlockTag) => {
      if (providerOrSigner instanceof LedgerLiveSigner) {
        return providerOrSigner.provider!.getBlock(blockTag)
      }
      const provider = getProviderOrSigner(
        providerOrSigner as any
      ) as Web3Provider

      return provider.getBlock(blockTag)
    },
    [providerOrSigner]
  )
}
