import { useCallback } from "react"
import { BlockTag } from "@ethersproject/abstract-provider"
import { Web3Provider } from "@ethersproject/providers"
import { useThreshold } from "../../contexts/ThresholdContext"
import { getProviderOrSigner } from "../../threshold-ts/utils"
import { LedgerLiveSigner } from "../../utils/ledger"

export const useGetBlock = () => {
  const threshold = useThreshold()
  const ethereumProviderOrSigner =
    threshold.config.ethereum.ethereumProviderOrSigner

  return useCallback(
    async (blockTag: BlockTag) => {
      if (ethereumProviderOrSigner instanceof LedgerLiveSigner) {
        return ethereumProviderOrSigner.provider!.getBlock(blockTag)
      }
      const provider = getProviderOrSigner(
        ethereumProviderOrSigner as any
      ) as Web3Provider

      return provider.getBlock(blockTag)
    },
    [ethereumProviderOrSigner]
  )
}
