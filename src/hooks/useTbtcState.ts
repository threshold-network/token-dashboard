import { useSelector, useDispatch } from "react-redux"
import { setMintAction as setMintActionAction } from "../store/tbtc"
import { RootState } from "../store"
import { TbtcMintAction, UseTbtcState } from "../types/tbtc"

export const useTbtcState: UseTbtcState = () => {
  const tbtcState = useSelector((state: RootState) => state.tbtc)
  const dispatch = useDispatch()

  const setMintAction = (mintAction: TbtcMintAction) =>
    dispatch(setMintActionAction({ mintAction }))

  return {
    ...tbtcState,
    setMintAction,
  }
}
