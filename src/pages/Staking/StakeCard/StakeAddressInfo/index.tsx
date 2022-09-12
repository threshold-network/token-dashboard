import { FC } from "react"
import { BoxLabel, Flex } from "@threshold-network/components"
import { CopyAddressToClipboard } from "../../../../components/CopyToClipboard"
import { StakeData } from "../../../../types"

const StakeAddressInfo: FC<{ stakingProvider: string }> = ({
  stakingProvider,
}) => {
  return (
    <Flex mt="6" mb="8" alignItems="center">
      <BoxLabel bg="brand.50" color="brand.700" mr="auto">
        Provider address
      </BoxLabel>
      <CopyAddressToClipboard address={stakingProvider} />
    </Flex>
  )
}

export default StakeAddressInfo
