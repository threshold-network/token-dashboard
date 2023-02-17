import { FC } from "react"
import { BoxLabel, HStack } from "@threshold-network/components"
import { CopyAddressToClipboard } from "../../../components/CopyToClipboard"

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
        <CopyAddressToClipboard
          color={isPrimary ? "brand.500" : "gray.500"}
          address={address}
        />
      ) : (
        children
      )}
    </HStack>
  )
}

export default StakeDetailRow
