import { FC } from "react"
import {
  Button,
  Icon,
  Stack,
  StackDivider,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { BiRightArrowAlt } from "react-icons/all"
import { H4 } from "@threshold-network/components"
import { WalletOption } from "../../../types"
import { ColorMode, WalletType } from "../../../enums"

const InitialWalletSelection: FC<{
  walletOptions: WalletOption[]
  onSelect: (walletType: WalletType) => void
}> = ({ walletOptions, onSelect }) => {
  const { colorMode } = useColorMode()
  return (
    <VStack divider={<StackDivider margin="0 40px !important" />}>
      {walletOptions.map((opt) => {
        const icon =
          colorMode === ColorMode.DARK ? opt.icon.dark : opt.icon.light
        return (
          <Button
            key={opt.id}
            variant="unstyled"
            w="100%"
            h="100px"
            _hover={{ bg: useColorModeValue("gray.100", "gray.500") }}
            _active={{ bg: "gray.300" }}
            borderRadius={0}
            onClick={() => onSelect(opt.id)}
          >
            <Stack justify="space-between" direction="row" px="40px">
              <Stack direction="row">
                <Icon as={icon} h="40px" w="40px" mr="32px" />
                <H4>{opt.title}</H4>
              </Stack>
              <Icon as={BiRightArrowAlt} h="40px" w="40px" />
            </Stack>
          </Button>
        )
      })}
    </VStack>
  )
}

export default InitialWalletSelection
