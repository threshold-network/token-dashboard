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
  const tbtcv1 = useTBTCTokenContract()
  const tbtc = useTBTCv2TokenContract()

  return {
    [Token.Keep]: keep,
    [Token.Nu]: nu,
    [Token.T]: t,
    [Token.TBTCV1]: tbtcv1,
    [Token.TBTC]: tbtc,
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
