import { useWeb3React } from "@web3-react/core"
import { useCallback } from "react"
import { Contract } from "@ethersproject/contracts"

const useAddErc20ToMetamask = (tokenContract?: Contract | null) => {
  const { library } = useWeb3React()

  const addToMetamask = useCallback(async () => {
    if (!library && !tokenContract) {
      return false
    }

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
      // Based on the docs, the result from request should be `boolean` but it
      // returns an object in Chrome. On Firefox browser, this request blocks
      // the MM provider and the dapp can't trigger transacion and fetch
      // on-chain data. Also the MM provider doesn't return any result from this
      // request. On Chrome browser, this request returns a result as an object,
      // even if the user does not make any interaction in the MM popup.
      // Ref: https://docs.metamask.io/guide/rpc-api.html#returns-9
      const result = await library.provider.request({
        method: "wallet_watchAsset",
        params,
      })
      return Boolean(result)
    } catch (error) {
      console.error("Could not add ERC20 token to MetaMask", error)
      return false
    }
  }, [library, tokenContract])

  return addToMetamask
}

export default useAddErc20ToMetamask
