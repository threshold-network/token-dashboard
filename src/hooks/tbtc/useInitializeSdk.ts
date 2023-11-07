import { TBTC as SDK } from "@keep-network/sdk-tbtc-v2.ts"
import { providers, Signer } from "ethers"
import { useCallback, useState } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"

export const useInitializeSdk = () => {
  const [sdk, setSdk] = useState<SDK | undefined>(undefined)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitializedWithSigner, setIsInitializedWithSigner] = useState(false)
  const threshold = useThreshold()

  const initializeSdk = useCallback(
    async (providerOrSigner: providers.Provider | Signer, account?: string) => {
      if (!isInitializing) {
        setIsInitializing(true)
        const sdk = await threshold.tbtc.initializeSdk(
          providerOrSigner,
          account
        )
        setSdk(sdk)
        setIsInitializing(false)
        const isInitializedWithSigner = account ? true : false
        setIsInitializedWithSigner(isInitializedWithSigner)
      }
    },
    [threshold, setSdk, setIsInitializing, setIsInitializedWithSigner]
  )

  return {
    sdk,
    isSdkInitializing: isInitializing,
    isSdkInitializedWithSigner: isInitializedWithSigner,
    setIsInitializing,
    initializeSdk,
  }
}
