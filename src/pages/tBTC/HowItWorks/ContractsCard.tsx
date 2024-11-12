import { FC, ComponentProps } from "react"
import { List } from "@chakra-ui/react"
import { Card, LabelSm } from "@threshold-network/components"
import DetailedLinkListItem from "../../../components/DetailedLinkListItem"
import { useTBTCTokenAddress } from "../../../hooks/useTBTCTokenAddress"
import { IoLinkSharp } from "react-icons/all"
import { useTBTCBridgeContractAddress } from "../../../hooks/useTBTCBridgeContractAddress"
import { useIsActive } from "../../../hooks/useIsActive"
import { ExplorerDataType } from "../../../networks/enums/networks"
import { createExplorerLink } from "../../../networks/utils/createExplorerLink"

export const ContractsCard: FC<ComponentProps<typeof Card>> = (props) => {
  const tbtcTokenContractAddress = useTBTCTokenAddress()
  const bridgeContractAddress = useTBTCBridgeContractAddress()
  const { chainId } = useIsActive()

  return (
    <Card {...props}>
      <LabelSm mb={8}>Contracts</LabelSm>
      <List spacing="2">
        {tbtcTokenContractAddress && (
          <DetailedLinkListItem
            icon={IoLinkSharp}
            title="Token Contract"
            href={createExplorerLink(
              chainId,
              tbtcTokenContractAddress,
              ExplorerDataType.ADDRESS
            )}
          />
        )}
        {bridgeContractAddress && (
          <DetailedLinkListItem
            icon={IoLinkSharp}
            title="Bridge Contract"
            href={createExplorerLink(
              chainId,
              bridgeContractAddress,
              ExplorerDataType.ADDRESS
            )}
          />
        )}
      </List>
    </Card>
  )
}
