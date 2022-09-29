import { FC } from "react"
import { BoxLabel, Flex, FlexProps } from "@threshold-network/components"
import { CopyAddressToClipboard } from "../../../../components/CopyToClipboard"

const StakeAddressInfo: FC<FlexProps & { stakingProvider: string }> = ({
  stakingProvider,
  ...restProps
}) => {
  return (
    <Flex mt="6" mb="8" alignItems="center" {...restProps}>
      <BoxLabel bg="brand.50" color="brand.700" mr="auto">
        Provider Address
      </BoxLabel>
      <CopyAddressToClipboard address={stakingProvider} />
    </Flex>
  )
}

export default StakeAddressInfo
