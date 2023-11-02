import { ComponentType } from "react"
import { H5 } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { useIsActive } from "../hooks/useIsActive"

function withOnlyConnectedWallet<T>(
  Component: ComponentType<T>,
  renderNotConnected?: () => JSX.Element
) {
  return (props: T & {}) => {
    const { account, isActive } = useIsActive()
    if (!isActive || !account) {
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
