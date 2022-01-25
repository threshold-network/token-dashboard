import { useWeb3React } from "@web3-react/core"
import { useCallback } from "react"
import { Contract } from "@ethersproject/contracts"

const useAddErc20ToMetamask = (tokenContract?: Contract | null) => {
  const { library } = useWeb3React()

  const addToMetamask = useCallback(async () => {
    if (library && tokenContract) {
      try {
        const decimals = await tokenContract?.decimals()
        const symbol = await tokenContract?.symbol()

        const params = {
          type: "ERC20",
          options: {
            address: tokenContract?.address,
            symbol: symbol,
            decimals: decimals,
            // image: "some-url",
          },
        }

        await library.provider.request({
          method: "wallet_watchAsset",
          params,
        })
      } catch (e) {
        console.log(e) // eslint-disable-line no-console
      }
    }
  }, [library, tokenContract])

  return addToMetamask
}

export default useAddErc20ToMetamask
