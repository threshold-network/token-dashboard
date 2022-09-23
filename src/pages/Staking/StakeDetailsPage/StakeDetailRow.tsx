import { FC } from "react"
import { BodyMd, BoxLabel, HStack } from "@threshold-network/components"
import CopyToClipboard from "../../../components/CopyToClipboard"
import shortenAddress from "../../../utils/shortenAddress"

type CommonProps = {
  label: string
  isPrimary?: boolean
}
type ConditionalProps =
  | {
      isAddress?: false
      address?: never
    }
  | {
      isAddress: true
      address: string
    }

type Props = CommonProps & ConditionalProps

const StakeDetailRow: FC<Props> = ({
  label,
  isAddress,
  address,
  isPrimary,
  children,
}) => {
  return (
    <HStack justify="space-between" minH="40px">
      <BoxLabel status={isPrimary ? "primary" : "secondary"}>{label}</BoxLabel>
      {isAddress ? (
        <CopyToClipboard textToCopy={address}>
          <BodyMd color={isPrimary ? "brand.500" : "gray.500"}>
            {shortenAddress(address)}
          </BodyMd>
        </CopyToClipboard>
      ) : (
        children
      )}
    </HStack>
  )
}

export default StakeDetailRow
