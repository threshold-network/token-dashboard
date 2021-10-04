import {
  Button,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react"
import { BiRightArrowAlt } from "react-icons/all"
import { useModal } from "../../../store/modal"
import { LedgerIcon } from "../../../static/icons/LedgerIcon"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { WalletConnectIcon } from "../../../static/icons/WalletConect"

const SelectWalletModal = () => {
  const { closeModal } = useModal()

  const walletOptions = [
    { title: "MetaMask", icon: MetaMaskIcon },
    { title: "Ledger", icon: LedgerIcon },
    { title: "WalletConnect", icon: WalletConnectIcon },
  ]

  return (
    <Modal isOpen onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect a Wallet</ModalHeader>
        <ModalCloseButton />

        <VStack divider={<StackDivider margin="0 40px !important" />}>
          {walletOptions.map((opt) => (
            <Button
              variant="unstyled"
              w="100%"
              h="100px"
              _hover={{ bg: "gray.100" }}
              _active={{ bg: "gray.300" }}
              borderRadius={0}
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
      </ModalContent>
    </Modal>
  )
}
export default SelectWalletModal
