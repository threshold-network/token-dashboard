import { useSelector } from "react-redux"
import { RootState } from "../store"
import { EthStateData } from "../types"

export const useETHData = (): EthStateData => {
  return useSelector((state: RootState) => state.eth)
}
