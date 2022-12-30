import { BigNumber } from "ethers"
import { featureFlags } from "../../constants"
import { Token } from "../../enums"
import { isAddress } from "../../web3/utils"
import { walletConnected } from "../account"
import { AppListenerEffectAPI } from "../listener"
import {
  tokenBalanceFetched,
  tokenBalanceFetching,
  fetchTokenPriceUSD,
  tokenBalanceFetchFailed,
} from "./tokenSlice"

export const fetchTokenBalances = async (
  actionCreator: ReturnType<typeof walletConnected>,
  listenerApi: AppListenerEffectAPI
) => {
  const address = actionCreator.payload
  if (!isAddress(address)) return

  const { keep, nu, t, tbtc, tbtcv1 } = listenerApi.extra.threshold.token

  const tokens = [
    { token: keep, name: Token.Keep },
    { token: nu, name: Token.Nu },
    { token: t, name: Token.T },
    { token: tbtcv1, name: Token.TBTCV1 },
    { token: tbtc, name: Token.TBTC },
  ]

  if (featureFlags.TBTC_V2) {
    tokens.push({ token: tbtc, name: Token.TBTC })
  }

  listenerApi.unsubscribe()
  try {
    tokens.forEach((_) => {
      listenerApi.dispatch(
        tokenBalanceFetching({
          token: _.name,
        })
      )
    })

    const balances: BigNumber[] =
      await listenerApi.extra.threshold.multicall.aggregate(
        tokens
          .map((_) => _.token)
          .map((_) => ({
            interface: _.contract.interface,
            address: _.contract.address,
            method: "balanceOf",
            args: [address],
          }))
      )

    tokens.forEach((_, index) => {
      listenerApi.dispatch(
        tokenBalanceFetched({
          token: _.name,
          balance: balances[index].toString(),
        })
      )
    })

    tokens
      .map((_) => _.name)
      .forEach((tokenName) =>
        listenerApi.dispatch(fetchTokenPriceUSD({ token: tokenName }))
      )
  } catch (error) {
    console.error("Could not fetch token balances", error)
    tokens
      .map((_) => _.name)
      .forEach((tokenName) =>
        listenerApi.dispatch(
          tokenBalanceFetchFailed({
            token: tokenName,
            error: `Could not fetch token balances. Error: ${(
              error as Error
            )?.toString()}`,
          })
        )
      )
    listenerApi.subscribe()
  }
}
