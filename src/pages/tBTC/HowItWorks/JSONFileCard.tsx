import { FC, ComponentProps } from "react"
import { LabelSm, Card, BodySm, Image } from "@threshold-network/components"
import btcJsonFile from "../../../static/images/tbtc-json-file.png"
import Link from "../../../components/Link"
import { ExternalHref } from "../../../enums"

export const JSONFileCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  return (
    <Card {...props}>
      <LabelSm mb="8">JSON file for fund recoveries</LabelSm>
      <BodySm mb="5">
        The JSON file is important to save in case you need to recover your
        funds.
      </BodySm>
      <BodySm mb="5">
        It’s important to keep this JSON file until you have successfully
        initiated tBTC minting.
      </BodySm>
      <BodySm mb="5">
        This file contains your BTC recovery address, the wallet's public key,
        the refund public key, and the refund lock time of this deposit. It can
        be used to reconstruct the deposit address in case of system error.
      </BodySm>
      <BodySm mb="5">
        Each new deposit will generate a new JSON file. Take note: Recovery time
        lock is currently 9 months.
      </BodySm>
      <BodySm mb="5">
        Recovery guide can be found{" "}
        <Link isExternal href={ExternalHref.tBTCRecoveryGuide}>
          here
        </Link>
        .
      </BodySm>
      <Image my="10" mx="auto" maxW="210px" src={btcJsonFile} />
    </Card>
  )
}
