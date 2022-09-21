import { useWeb3React } from "@web3-react/core"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setConnectedAccountAddress } from "../store/connected-account"

export const useSaveConnectedAddressToStore = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    const address = account ? account : ""
    dispatch(setConnectedAccountAddress(address))
  }, [account])
}
