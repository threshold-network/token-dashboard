import { FC } from "react"
import { BoxLabel, HStack } from "@threshold-network/components"
import { CopyAddressToClipboard } from "../../../components/CopyToClipboard"

type CommonProps = {
  label: string
  isPrimary?: boolean
}
type ConditionalProps =
  | {
      isEthereumAddress?: false
      address?: never
    }
  | {
      isEthereumAddress: true
      address: string
    }

type Props = CommonProps & ConditionalProps

const StakeDetailRow: FC<Props> = ({
  label,
  isEthereumAddress,
  address,
  isPrimary,
  children,
}) => {
  return (
    <HStack justify="space-between" minH="40px">
      <BoxLabel status={isPrimary ? "primary" : "secondary"}>{label}</BoxLabel>
      {isEthereumAddress ? (
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
