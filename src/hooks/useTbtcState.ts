import { useDispatch, useSelector } from "react-redux"
import {
  advanceMintingStep as advanceMintingStepAction,
  rewindMintingStep as rewindMintingStepAction,
  setMintAction as setMintActionAction,
} from "../store/tbtc"
import { RootState } from "../store"
import { TbtcMintAction, UseTbtcState } from "../types/tbtc"

export const useTbtcState: UseTbtcState = () => {
  const tbtcState = useSelector((state: RootState) => state.tbtc)
  const dispatch = useDispatch()

  const setMintAction = (mintAction: TbtcMintAction) =>
    dispatch(setMintActionAction({ mintAction }))
  const advanceMintingStep = () => dispatch(advanceMintingStepAction())
  const rewindMintingStep = () => dispatch(rewindMintingStepAction())

  return {
    ...tbtcState,
    setMintAction,
    advanceMintingStep,
    rewindMintingStep,
  }
}
