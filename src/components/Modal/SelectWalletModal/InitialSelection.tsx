import { FC } from "react"
import {
  Button,
  Icon,
  Stack,
  StackDivider,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { BiRightArrowAlt } from "react-icons/all"
import { H4 } from "../../Typography"
import { WalletOption } from "../../../types"

const InitialWalletSelection: FC<{
  walletOptions: WalletOption[]
}> = ({ walletOptions }) => {
  return (
    <VStack divider={<StackDivider margin="0 40px !important" />}>
      {walletOptions.map((opt) => (
        <Button
          key={opt.id}
          variant="unstyled"
          w="100%"
          h="100px"
          _hover={{ bg: useColorModeValue("gray.100", "gray.500") }}
          _active={{ bg: "gray.300" }}
          borderRadius={0}
          onClick={opt.onClick}
        >
          <Stack justify="space-between" direction="row" px="40px">
            <Stack direction="row">
              <Icon as={opt.icon} h="40px" w="40px" mr="32px" />
              <H4>{opt.title}</H4>
            </Stack>
            <Icon as={BiRightArrowAlt} h="40px" w="40px" />
          </Stack>
        </Button>
      ))}
    </VStack>
  )
}

export default InitialWalletSelection
