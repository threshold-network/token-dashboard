import { Token } from "../enums"
import { selectTokenByTokenName } from "../store/tokens/selectors"
import {
  useKeep,
  useNu,
  useT,
  useTBTCTokenContract,
  useTBTCv2TokenContract,
} from "../web3/hooks"
import { useAppSelector } from "./store"

const useSupportedTokens = () => {
  const keep = useKeep()
  const nu = useNu()
  const t = useT()
  const tbtc = useTBTCTokenContract()
  const tbtcv2 = useTBTCv2TokenContract()

  return {
    [Token.Keep]: keep,
    [Token.Nu]: nu,
    [Token.T]: t,
    [Token.TBTC]: tbtc,
    [Token.TBTCV2]: tbtcv2,
  }
}

export const useToken = (token: Token) => {
  const tokenState = useAppSelector((state) =>
    selectTokenByTokenName(state, token)
  )
  const _token = useSupportedTokens()[token]

  return {
    ...tokenState,
    ..._token,
  }
}
