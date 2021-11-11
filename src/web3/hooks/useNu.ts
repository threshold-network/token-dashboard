import { useErc20TokenContract } from "./useERC20"
import { useWeb3React } from "@web3-react/core"
import { Token } from "../../enums"

// TODO grab these from env?
const NU_MAINNET = "0x4fe83213d56308330ec302a8bd641f1d0113a4cc"
const NU_GOERLI = "0x02B50E38E5872068F325B1A7ca94D90ce2bfff63"
const NU_RINKEBY = "0x78D591D90a4a768B9D2790deA465D472b6Fe0f18"

export interface UseNu {
  (): {
    approveNu: () => void
    fetchNuBalance: () => void
  }
}

export const useNu: UseNu = () => {
  const { chainId } = useWeb3React()
  const contractAddress = chainId === 3 ? NU_GOERLI : NU_MAINNET
  const { balanceOf, approve } = useErc20TokenContract(contractAddress)

  const approveNu = () => {
    approve(Token.Nu)
  }

  const fetchNuBalance = () => {
    balanceOf(Token.Nu)
  }

  return {
    fetchNuBalance,
    approveNu,
  }
}
