import { ComponentType } from "react"
import { H5 } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"

function withOnlyConnectedWallet<T>(
  Component: ComponentType<T>,
  renderNotConnected?: () => JSX.Element
) {
  return (props: T & {}) => {
    const { account, active } = useWeb3React()
    if (!active || !account) {
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
