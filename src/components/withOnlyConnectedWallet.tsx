import { ComponentType } from "react"
import { H5 } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { useAppSelector } from "../hooks/store"
import { selectAccountState } from "../store/account"

function withOnlyConnectedWallet<T>(
  Component: ComponentType<T>,
  renderNotConnected?: () => JSX.Element
) {
  return (props: T & {}) => {
    const { address } = useAppSelector(selectAccountState)
    if (!address) {
      return renderNotConnected ? (
        renderNotConnected()
      ) : (
        <H5 align={"center"}>Wallet not connected</H5>
      )
    }
    return <Component {...props} />
  }
}

export default withOnlyConnectedWallet
