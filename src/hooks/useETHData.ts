import { useSelector } from "react-redux"
import { RootState } from "../store"
import { EthReduxData } from "../types"

export const useETHData = (): EthReduxData => {
  return useSelector((state: RootState) => state.eth)
}
