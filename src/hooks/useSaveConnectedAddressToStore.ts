import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { walletConnected } from "../store/account"
import { useIsActive } from "./useIsActive"

export const useSaveConnectedAddressToStore = () => {
  const { account, chainId } = useIsActive()
  const dispatch = useDispatch()

  useEffect(() => {
    const address = account ? account : ""
    dispatch(walletConnected({ address, chainId }))
  }, [account])
}
