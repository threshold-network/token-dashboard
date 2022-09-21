import { FC } from "react"
import { BodyMd, BoxLabel, HStack } from "@threshold-network/components"
import CopyToClipboard from "../../../components/CopyToClipboard"
import shortenAddress from "../../../utils/shortenAddress"

const StakeDetailRow: FC<{
  label: string
  value: string | JSX.Element
  isPrimary?: boolean
}> = ({ label, value, isPrimary }) => {
  return (
    <HStack justify="space-between" minH="40px">
      <BoxLabel status={isPrimary ? "primary" : "secondary"}>{label}</BoxLabel>
      {typeof value === "string" ? (
        <CopyToClipboard textToCopy={value}>
          <BodyMd color={isPrimary ? "brand.500" : "gray.500"}>
            {shortenAddress(value)}
          </BodyMd>
        </CopyToClipboard>
      ) : (
        value
      )}
    </HStack>
  )
}

export default StakeDetailRow
