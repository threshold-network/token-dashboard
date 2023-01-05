import { FC, ComponentProps } from "react"
import { LabelSm, Card, BodySm, Image } from "@threshold-network/components"
import btcJsonFile from "../../../static/images/tbtc-json-file.png"

export const JSONFileCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  return (
    <Card {...props}>
      <LabelSm mb="8">.json file for fast recoveries</LabelSm>
      <BodySm mb="5">
        The .JSON file is important to save in case you need to make a fast
        recovery.
      </BodySm>
      <BodySm>
        This file contains a wallet public key, a refund public key and a refund
        lock time. It reconstructs the deposit address in case a very unlikely
        incident were to happen.
      </BodySm>
      <Image my="10" mx="auto" maxW="210px" src={btcJsonFile} />
    </Card>
  )
}
