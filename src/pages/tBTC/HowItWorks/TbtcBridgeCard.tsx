import { FC, ComponentProps } from "react"
import {
  BodyMd,
  LabelSm,
  Card,
  Wrap,
  WrapItem,
  Image,
  useColorModeValue,
  Box,
} from "@threshold-network/components"
import tbtcAppIllustrationLight from "../../../static/images/tbtcAppIllustrationLight.svg"
import tbtcAppIllustrationDark from "../../../static/images/tbtcAppIllustrationDark.svg"

export const TbtcBridgeCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  const tbtcAppImg = useColorModeValue(
    tbtcAppIllustrationLight,
    tbtcAppIllustrationDark
  )
  return (
    <Card
      {...props}
      display="flex"
      flexDirection={{ base: "column", xl: "row" }}
      p="8"
    >
      <Box mr={{ base: "none", lg: "20" }}>
        <LabelSm mb={5} textTransform="none">
          tBTC BRIDGE
        </LabelSm>
        <BodyMd mb="5">
          The second generation of tBTC is a truly decentralized bridge between
          Bitcoin and Ethereum.
        </BodyMd>
        <BodyMd>
          By providing Bitcoin holders permissionless access to DeFi and the
          expanding web3 universe.
        </BodyMd>
      </Box>

      <Image src={tbtcAppImg} />
    </Card>
  )
}
