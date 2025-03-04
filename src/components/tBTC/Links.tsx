import { FC, ComponentProps } from "react"
import { useTBTCBridgeContractAddress } from "../../hooks/useTBTCBridgeContractAddress"
import { ExplorerDataType } from "../../networks/enums/networks"
import ViewInBlockExplorer from "../ViewInBlockExplorer"
import { useTBTCTokenAddress } from "../../hooks/useTBTCTokenAddress"
import { useIsActive } from "../../hooks/useIsActive"

type Props = Omit<
  ComponentProps<typeof ViewInBlockExplorer>,
  "text" | "id" | "type"
> & {
  text?: string
}

export const BridgeContractLink: FC<Props> = ({
  text = "Bridge Contract",
  ...props
}) => {
  const address = useTBTCBridgeContractAddress()
  return address ? (
    <ViewInBlockExplorer
      id={address}
      type={ExplorerDataType.ADDRESS}
      text={text}
      {...props}
      data-ph-capture-attribute-button-name={`Bridge contract link (Deposit flow)`}
    />
  ) : (
    <></>
  )
}

export const TBTCTokenContractLink: FC<Props> = ({
  text = "token address",
  ...props
}) => {
  const address = useTBTCTokenAddress()
  const { chainId } = useIsActive()

  return address ? (
    <ViewInBlockExplorer
      id={address}
      type={ExplorerDataType.ADDRESS}
      text={text}
      ethereumNetworkChainId={chainId}
      {...props}
    />
  ) : (
    <></>
  )
}
