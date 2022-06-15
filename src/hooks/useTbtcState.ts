import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { TbtcStateKey, UseTbtcState } from "../types/tbtc"
import { updateState as updateStateAction } from "../store/tbtc"

export const useTbtcState: UseTbtcState = () => {
  const tbtcState = useSelector((state: RootState) => state.tbtc)
  const dispatch = useDispatch()

  const updateState = (key: TbtcStateKey, value: any) =>
    dispatch(updateStateAction({ key, value }))

  return {
    ...tbtcState,
    updateState,
  }
}
