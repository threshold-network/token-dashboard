import KeepToken from "@keep-network/keep-core/artifacts/KeepToken.json"
// import { useWeb3React } from "@web3-react/core"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"

// TODO grab these from env?
const KEEP_MAINNET = "0x85eee30c52b0b379b046fb0f85f4f3dc3009afec"
const KEEP_ROPSTEN = "0xab584929f7e0d994617209d7207527b5ed8da57e"

export interface UseKeep {
  (): {
    approveKeep: () => void
    fetchKeepBalance: () => void
  }
}

export const useKeep = () => {
  // const { chainId } = useWeb3React()

  const { balanceOf, approve, contract } = useErc20TokenContract(
    // TODO handle chainID
    KeepToken.networks[1337].address,
    undefined,
    KeepToken.abi
  )

  const approveKeep = () => {
    approve(TransactionType.ApproveKeep)
  }

  const fetchKeepBalance = () => {
    balanceOf(Token.Keep)
  }

  return {
    approveKeep,
    fetchKeepBalance,
    contract,
  }
}
