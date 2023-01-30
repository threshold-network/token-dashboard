import { FC, ComponentProps } from "react"
import { List } from "@chakra-ui/react"
import { Card, LabelSm } from "@threshold-network/components"
import DetailedLinkListItem from "../../../components/DetailedLinkListItem"
import { useTBTCTokenAddress } from "../../../hooks/useTBTCTokenAddress"
import createEtherscanLink, {
  ExplorerDataType,
} from "../../../utils/createEtherscanLink"
import { supportedChainId } from "../../../utils/getEnvVariable"
import { IoLinkSharp } from "react-icons/all"
import { useTBTCBridgeContractAddress } from "../../../hooks/useTBTCBridgeContractAddress"

export const ContractsCard: FC<ComponentProps<typeof Card>> = (props) => {
  const tbtcTokenContractAddress = useTBTCTokenAddress()
  const bridgeContractAddress = useTBTCBridgeContractAddress()

  return (
    <Card {...props}>
      <LabelSm mb={8}>Contracts</LabelSm>
      <List spacing="2">
        <DetailedLinkListItem
          icon={IoLinkSharp}
          title="Token Contract"
          href={createEtherscanLink(
            Number(supportedChainId),
            tbtcTokenContractAddress,
            ExplorerDataType.ADDRESS
          )}
        />
        <DetailedLinkListItem
          icon={IoLinkSharp}
          title="Bridge Contract"
          href={createEtherscanLink(
            Number(supportedChainId),
            bridgeContractAddress,
            ExplorerDataType.ADDRESS
          )}
        />
      </List>
    </Card>
  )
}
