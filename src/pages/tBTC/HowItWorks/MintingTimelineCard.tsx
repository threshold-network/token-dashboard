import { FC, ComponentProps } from "react"
import {
  BodyMd,
  LabelSm,
  Card,
  BoxLabel,
  List,
  ListItem,
  ListIcon,
} from "@threshold-network/components"
import { BsFillArrowRightCircleFill } from "react-icons/all"
import {
  MintingTimelineStep1,
  MintingTimelineStep2,
  MintingTimelineStep3,
} from "../Bridge/MintingCard/MintingTimeline"
import Link from "../../../components/Link"
import { ExternalHref } from "../../../enums"

export const MintingTimelineCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <LabelSm mb="8">Minting Timeline</LabelSm>
      <MintingTimelineStep1 isActive={true} isComplete={false} size="md" />
      <BoxLabel status="secondary" mb="4" mt="8">
        ETH Address
      </BoxLabel>
      <List>
        <ListItem>
          <ListIcon
            color="brand.500"
            verticalAlign="sub"
            as={BsFillArrowRightCircleFill}
            w="16px"
            h="16px"
          />
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
          <ListIcon
            verticalAlign="sub"
            color="brand.500"
            as={BsFillArrowRightCircleFill}
            w="16px"
            h="16px"
          />
          <BodyMd as="span">
            Providing a BTC refund address means your bitcoin will be safe, even
            in the unlikely case of an error minting.{" "}
            <Link isExternal href={ExternalHref.btcRecoveryAddress}>
              Read more
            </Link>
          </BodyMd>
        </ListItem>
        <ListItem>
          <ListIcon
            verticalAlign="sub"
            color="brand.500"
            as={BsFillArrowRightCircleFill}
            w="16px"
            h="16px"
          />
          <BodyMd as="span">
            Make sure you provide a single BTC recovery address that you
            control. Don't use a multi-sig or an exchange address. You can read
            more about the requirements and P2PKH.{" "}
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
      <MintingTimelineStep2
        isActive={true}
        isComplete={false}
        mb="8"
        size="md"
      />
      <MintingTimelineStep3
        isActive={true}
        isComplete={false}
        mb="8"
        size="md"
      />
    </Card>
  )
}
