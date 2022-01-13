import { FC } from "react"
import Card from "../../components/Card"
import { Body2, Body3, H3, Label3 } from "../../components/Typography"
import {
  Alert,
  AlertIcon,
  Box,
  HStack,
  Icon,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { formatNumeral } from "../../utils/formatAmount"
import { FiArrowUpRight } from "react-icons/all"

const RewardsCard: FC = () => {
  return (
    <Card>
      <Stack spacing={4}>
        <Box>
          <Label3 textDecoration="uppercase">Rewards</Label3>
          <Body2 mb={2}>Total Rewards</Body2>
          <HStack
            bg={useColorModeValue("gray.50", "gray.700")}
            mt={4}
            px={6}
            py={2}
            borderRadius="md"
            mb={2}
          >
            <H3>{formatNumeral(0)} T</H3>
          </HStack>
          <Body3 color="gray.500">
            Rewards are released at the end of each month
          </Body3>
        </Box>
      </Stack>
    </Card>
  )
}

export default RewardsCard
