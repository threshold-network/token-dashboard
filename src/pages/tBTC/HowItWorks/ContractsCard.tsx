import { FC, ComponentProps } from "react"
import { List } from "@chakra-ui/react"
import { Card, LabelSm } from "@threshold-network/components"
import DetailedLinkListItem from "../../../components/DetailedLinkListItem"
import { useTBTCTokenAddress } from "../../../hooks/useTBTCTokenAddress"
import createEtherscanLink, {
  ExplorerDataType,
} from "../../../utils/createEtherscanLink"
import { supportedChainId } from "../../../utils/getEnvVariable"
import { IoLinkSharp, IoLogoGithub } from "react-icons/all"
import { ExternalHref } from "../../../enums"

export const ContractsCard: FC<ComponentProps<typeof Card>> = (props) => {
  const tbtcTokenContractAddress = useTBTCTokenAddress()

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
          icon={IoLogoGithub}
          title="Bridge Contract"
          href={ExternalHref.tbtcBridgeGithub}
        />
      </List>
    </Card>
  )
}
