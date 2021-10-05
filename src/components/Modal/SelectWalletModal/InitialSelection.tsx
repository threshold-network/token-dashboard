import {
  Button,
  Icon,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react"
import { BiRightArrowAlt } from "react-icons/all"
import { FC } from "react"

const InitialWalletSelection: FC<{
  walletOptions: {
    id: string
    onClick: () => void
    icon: FC
    title: string
  }[]
}> = ({ walletOptions }) => {
  return (
    <VStack divider={<StackDivider margin="0 40px !important" />}>
      {walletOptions.map((opt) => (
        <Button
          key={opt.id}
          variant="unstyled"
          w="100%"
          h="100px"
          _hover={{ bg: "gray.100" }}
          _active={{ bg: "gray.300" }}
          borderRadius={0}
          onClick={opt.onClick}
        >
          <Stack justify="space-between" direction="row" px="40px">
            <Stack direction="row">
              <Icon as={opt.icon} h="40px" w="40px" mr="32px" />
              <Text color="gray.800" fontSize="30px">
                {opt.title}
              </Text>
            </Stack>
            <Icon as={BiRightArrowAlt} h="40px" w="40px" />
          </Stack>
        </Button>
      ))}
    </VStack>
  )
}

export default InitialWalletSelection
