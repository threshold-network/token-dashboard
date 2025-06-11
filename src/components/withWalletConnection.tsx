import { ComponentType } from "react"
import { H5 } from "@threshold-network/components"
import { useIsActive } from "../hooks/useIsActive"
import { useNonEVMConnection } from "../hooks/useNonEVMConnection"

function withWalletConnection<T>(
  Component: ComponentType<T>,
  renderNotConnected?: () => JSX.Element
) {
  return (props: T & {}) => {
    const { account, isActive } = useIsActive()
    const { isNonEVMActive } = useNonEVMConnection()

    // Check for either EVM or non-EVM wallet connection
    const isWalletConnected = (isActive && account) || isNonEVMActive

    if (!isWalletConnected) {
      return renderNotConnected ? (
        renderNotConnected()
      ) : (
        <H5 align={"center"}>Wallet not connected</H5>
      )
    }
    return <Component {...props} />
  }
}

export default withWalletConnection
