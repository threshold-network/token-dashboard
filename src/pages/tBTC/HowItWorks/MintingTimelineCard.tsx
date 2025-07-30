import { FC, ComponentProps } from "react"
import {
  BodyMd,
  LabelSm,
  Card,
  BoxLabel,
  List,
  ListItem,
  ListIcon as TListIcon,
} from "@threshold-network/components"
import { BsFillArrowRightCircleFill } from "react-icons/all"
import {
  MintingTimelineStep1,
  MintingTimelineStep2,
  MintingTimelineStep3,
} from "../Deposit/Minting/MintingTimeline"
import Link from "../../../components/Link"
import { ExternalHref } from "../../../enums"
import { Steps } from "../../../components/Step"
import { getBridgeBTCSupportedAddressPrefixesText } from "../../../utils/tBTC"
import { BitcoinNetwork } from "../../../threshold-ts/types"

const ListIcon: FC = () => (
  <TListIcon
    color="brand.500"
    verticalAlign="sub"
    as={BsFillArrowRightCircleFill}
    w="16px"
    h="16px"
  />
)

export const MintingTimelineCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <LabelSm mb="8">Minting Timeline</LabelSm>
      <Steps size="md">
        <MintingTimelineStep1 isActive={true} isComplete={false} />
        <BoxLabel status="secondary" mb="4" mt="8">
          ETH Address
        </BoxLabel>
        <List>
          <ListItem>
            <ListIcon />
            <BodyMd as="span">
              This is where your tBTC (ERC20) will be sent after minting
              initiation.
            </BodyMd>
          </ListItem>
        </List>
        <BoxLabel status="secondary" mb="4" mt="4">
          Recovery BTC Address
        </BoxLabel>
        <List mb="1.5rem" spacing="4">
          <ListItem>
            <ListIcon />
            <BodyMd as="span">
              Providing a BTC refund address means your bitcoin will be safe,
              even in the unlikely case of an error minting.{" "}
              <Link isExternal href={ExternalHref.btcRecoveryAddress}>
                Read more
              </Link>
            </BodyMd>
          </ListItem>
          <ListItem>
            <ListIcon />
            <BodyMd as="span">
              Make sure you provide a single BTC recovery address that you
              control. Don't use a multi-sig or an exchange address. You can
              read more about the requirements and P2PKH.{" "}
              <Link isExternal href={ExternalHref.btcRecoveryAddress}>
                Read more
              </Link>
            </BodyMd>
          </ListItem>
          <ListItem>
            <ListIcon />
            <BodyMd as="span">
              This address has to start with{" "}
              {getBridgeBTCSupportedAddressPrefixesText(
                "mint",
                BitcoinNetwork.Mainnet
              )}
              for Bitcoin Mainnet and with{" "}
              {getBridgeBTCSupportedAddressPrefixesText(
                "mint",
                BitcoinNetwork.Testnet
              )}{" "}
              for Testnet Bitcoin. This means that your addresses are P2PKH or
              P2WPKH compliant.{" "}
              <Link isExternal href={ExternalHref.btcRecoveryAddress}>
                Read more
              </Link>
            </BodyMd>
          </ListItem>
        </List>
        <BodyMd mb="8">
          Based on these two addresses, the protocol will create a unique BTC
          deposit address using a P2SWH for each user.{" "}
          <Link isExternal href={ExternalHref.btcRecoveryAddress}>
            Read more
          </Link>
        </BodyMd>
        <MintingTimelineStep2 isActive={true} isComplete={false} mb="8" />
        <MintingTimelineStep3 isActive={true} isComplete={false} mb="8" />
      </Steps>
    </Card>
  )
}
