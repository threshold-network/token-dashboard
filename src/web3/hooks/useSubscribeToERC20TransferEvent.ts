import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"
import { Token } from "../../enums/token"
import { useSubscribeToContractEvent } from "./useSubscribeToContractEvent"
import { useTokenBalance } from "../../hooks/useTokenBalance"
import { isSameETHAddress } from "../../utils/isSameETHAddress"
import { useTokenState } from "../../hooks/useTokenState"
import { useToken } from "../../hooks/useToken"
import { useCallback } from "react"

export const useSubscribeToERC20TransferEvent = (token: Token) => {
  const { account } = useWeb3React()
  const { contract } = useToken(token)
  const currentTokenBalance = useTokenBalance(token)

  // TODO: Debug this issue: https://keepnetwork.atlassian.net/browse/DAPP-515
  // the balance is always 0 in the callback. Seems like the ref updater in useSubscribeToContractEvent
  // is not updating this callback the correct balances ˆ
  console.log("current token balance: " + currentTokenBalance, token)

  const { setTokenBalance } = useTokenState()

  const balanceUpdater = useCallback(
    (from, to, amount) => {
      console.log(`Received ${token}.Transfer event`, {
        from,
        to,
        amount: amount.toString(),
      })

      console.log("increase? ", isSameETHAddress(to, account!))
      console.log("decrease? ", isSameETHAddress(from, account!))

      // transfer in - increase token balance
      if (isSameETHAddress(to, account!)) {
        setTokenBalance(
          token,
          BigNumber.from(currentTokenBalance)
            .add(BigNumber.from(amount))
            .toString()
        )

        // transfer out - decrease token balance
      } else if (isSameETHAddress(from, account!)) {
        console.log("the current token balance: ", currentTokenBalance)

        setTokenBalance(
          token,
          BigNumber.from(currentTokenBalance)
            .sub(BigNumber.from(amount))
            .toString()
        )
      }
    },
    [account, contract, currentTokenBalance, setTokenBalance]
  )

  // @ts-ignore
  useSubscribeToContractEvent(contract, "Transfer", balanceUpdater)
}
