import { FC } from "react"
import { BoxLabel, Flex, FlexProps } from "@threshold-network/components"
import { CopyAddressToClipboard } from "../../../../components/CopyToClipboard"
import { StakeData } from "../../../../types"

const StakeAddressInfo: FC<{ stake: StakeData } & FlexProps> = ({
  stake,
  ...restProps
}) => {
  return (
    <Flex mt="6" mb="8" alignItems="center" {...restProps}>
      <BoxLabel bg="brand.50" color="brand.700" mr="auto">
        Provider address
      </BoxLabel>
      <CopyAddressToClipboard address={stake.stakingProvider} />
    </Flex>
  )
}

export default StakeAddressInfo
