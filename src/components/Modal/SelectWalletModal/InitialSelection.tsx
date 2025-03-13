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
import { H4 } from "@threshold-network/components"
import { WalletOption } from "../../../types"
import { WalletType } from "../../../enums"
import useChakraBreakpoint from "../../../hooks/useChakraBreakpoint"

type InitialWalletSelectionProps = {
  walletOptions: WalletOption[]
  onSelect: (walletType: WalletType) => void
}

const InitialWalletSelection: FC<InitialWalletSelectionProps> = ({
  walletOptions,
  onSelect,
}) => {
  const isMobile = useChakraBreakpoint("md")

  const filteredWalletOptions = isMobile
    ? walletOptions.filter((opt) => opt.id === WalletType.WalletConnect)
    : walletOptions

  return (
    <VStack divider={<StackDivider margin="0 40px !important" />}>
      {filteredWalletOptions.map((opt) => (
        <WalletButton key={opt.id} option={opt} onSelect={onSelect} />
      ))}
    </VStack>
  )
}

type WalletButtonProps = {
  option: WalletOption
  onSelect: (walletType: WalletType) => void
}

const WalletButton: FC<WalletButtonProps> = ({ option, onSelect }) => {
  const icon = useColorModeValue(option.icon.light, option.icon.dark)

  return (
    <Button
      variant="unstyled"
      w="100%"
      h="100px"
      _hover={{ bg: useColorModeValue("gray.100", "gray.500") }}
      _active={{ bg: "gray.300" }}
      borderRadius={0}
      onClick={() => onSelect(option.id)}
    >
      <Stack justify="space-between" direction="row" px="40px">
        <Stack direction="row">
          <Icon as={icon} h="40px" w="40px" mr="32px" />
          <H4>{option.title}</H4>
        </Stack>
        <Icon as={BiRightArrowAlt} h="40px" w="40px" />
      </Stack>
    </Button>
  )
}

export default InitialWalletSelection
