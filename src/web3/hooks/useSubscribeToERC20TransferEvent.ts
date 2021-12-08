import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"
import { Token } from "../../enums/token"
import { useSubscribeToContractEvent } from "./useSubscribeToContractEvent"
import { useTokenBalance } from "../../hooks/useTokenBalance"
import { isSameETHAddress } from "../../utils/isSameETHAddress"
import { useReduxToken } from "../../hooks/useReduxToken"
import { useToken } from "../../hooks/useToken"

export const useSubscribeToERC20TransferEvent = (token: Token) => {
  const { account } = useWeb3React()
  const { contract } = useToken(token)
  const currentTokenBalance = useTokenBalance(token)
  const { setTokenBalance } = useReduxToken()

  // @ts-ignore
  useSubscribeToContractEvent(contract, "Transfer", (from, to, amount) => {
    console.log(`Recived ${token}.Transfer event`, from, to, amount.toString())
    if (isSameETHAddress(to, account!)) {
      setTokenBalance(
        token,
        BigNumber.from(currentTokenBalance)
          .add(BigNumber.from(amount))
          .toString()
      )
    } else if (isSameETHAddress(from, account!)) {
      setTokenBalance(
        token,
        BigNumber.from(currentTokenBalance)
          .sub(BigNumber.from(amount))
          .toString()
      )
    }
  })
}
