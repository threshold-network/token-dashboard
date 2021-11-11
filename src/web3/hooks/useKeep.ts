import { useErc20TokenContract } from "./useERC20"
import { useWeb3React } from "@web3-react/core"
import { Token } from "../../enums"

// TODO grab these from env?
const KEEP_MAINNET = "0x85eee30c52b0b379b046fb0f85f4f3dc3009afec"
const KEEP_ROPSTEN = "0xab584929f7e0d994617209d7207527b5ed8da57e"

export const useKeep = () => {
  const { chainId } = useWeb3React()
  const contractAddress = chainId === 3 ? KEEP_ROPSTEN : KEEP_MAINNET
  const { balanceOf } = useErc20TokenContract(contractAddress)

  const fetchBalance = () => {
    balanceOf(Token.Keep)
  }

  return {
    fetchBalance,
  }
}
