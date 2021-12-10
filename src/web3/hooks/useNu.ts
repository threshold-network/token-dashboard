// import NuCypherToken from "@threshold-network/solidity-contracts/artifacts/NuCypherToken.json"
import { Contract } from "@ethersproject/contracts"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"

const DAI_ROPSTEN = "0xc2118d4d90b274016cB7a54c03EF52E6c537D957"

// export const useNu = () => {
//   const { account, chainId } = useWeb3React()
//   const { setTokenLoading, setTokenBalance } = useReduxToken()
//
//   // Checking for goerli Nu specifically
//   const contractAddress = chainId === 3 ? DAI_ROPSTEN : NU_MAINNET
//   const nuContract = useErc20TokenContract(contractAddress)
//
//   const fetchBalance = useCallback(async () => {
//     if (account && nuContract) {
//       try {
//         setTokenLoading(Token.Nu, true)
//         const rawWalletBalance = await nuContract.balanceOf(account as string)
//         // TODO do not hard code decimals
//         const balance = rawWalletBalance / 10 ** (await nuContract.decimals())
//         setTokenBalance(Token.Nu, balance)
//         setTokenLoading(Token.Nu, false)
//       } catch (error) {
//         setTokenLoading(Token.Nu, false)
//         console.log(`Error: Fetching NU balance failed for ${account}`, error)
//       }
//     }

export interface UseNu {
  (): {
    approveNu: () => void
    fetchNuBalance: () => void
    contract: Contract | null
  }
}

export const useNu: UseNu = () => {
  const { balanceOf, approve, contract } = useErc20TokenContract(
    DAI_ROPSTEN,
    // NuCypherToken.address,
    undefined,
    // NuCypherToken.abi
    undefined
  )

  const approveNu = () => {
    approve(TransactionType.ApproveNu)
  }

  const fetchNuBalance = () => {
    balanceOf(Token.Nu)
  }

  return {
    fetchNuBalance,
    approveNu,
    contract,
  }
}
