import { FC } from "react"
import { Box, Flex, FlexProps } from "@chakra-ui/react"
import { isAddressZero } from "../../../web3/utils"
import { BoxLabel } from "@threshold-network/components"
import { CopyAddressToClipboard } from "../../CopyToClipboard"

export const StakeCardProviderAddress: FC<
  {
    stakingProvider: string
  } & FlexProps
> = ({ stakingProvider, ...restProps }) => {
  const isNotAddressZero = !isAddressZero(stakingProvider)

  return (
    <Flex mt="6" mb="8" alignItems="center" {...restProps}>
      <BoxLabel bg="brand.50" color="brand.700" mr="auto">
        Provider address
      </BoxLabel>
      {isNotAddressZero ? (
        <CopyAddressToClipboard address={stakingProvider} />
      ) : (
        <Box as="span" color="brand.500">
          none set
        </Box>
      )}
    </Flex>
  )
}
