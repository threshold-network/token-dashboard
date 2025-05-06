import { ComponentType } from "react"
import { H5 } from "@threshold-network/components"
import { useIsActive } from "../hooks/useIsActive"
import { useNonEVMConnection } from "../hooks/useNonEVMConnection"

function withOnlyConnectedWallet<T>(
  Component: ComponentType<T>,
  renderNotConnected?: () => JSX.Element
) {
  return (props: T & {}) => {
    const { account, isActive } = useIsActive()
    const isNonEVMActive = useNonEVMConnection()

    if ((isActive && account) || isNonEVMActive) {
      return <Component {...props} />
    }
    return renderNotConnected ? (
      renderNotConnected()
    ) : (
      <H5 align={"center"}>Wallet not connected</H5>
    )
  }
}

export default withOnlyConnectedWallet
