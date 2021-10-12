import React, { FC } from "react"
import {
  Box,
  Button,
  HStack,
  Icon,
  ModalBody,
  ModalFooter,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { BiLeftArrowAlt } from "react-icons/all"
import { useWeb3React } from "@web3-react/core"
import { ConnectionError } from "../../../../types"

interface Props {
  goBack: () => void
  closeModal: () => void
  WalletIcon: any
  title: string
  subTitle?: string
  tryAgain?: () => void
  onContinue?: () => void
}

const WalletConnectionModalBase: FC<Props> = ({
  goBack,
  closeModal,
  WalletIcon,
  title,
  subTitle,
  children,
  tryAgain,
  onContinue,
}) => {
  const { error, active, account } = useWeb3React()

  return (
    <>
      <ModalBody>
        <Stack spacing={6}>
          <HStack justify="center">
            {React.isValidElement(WalletIcon) ? (
              WalletIcon
            ) : (
              <Icon as={WalletIcon} h="40px" w="40px" mr={4} />
            )}
            <Text fontSize="30px">{title}</Text>
          </HStack>
          {subTitle && (
            <Text align="center" color={useColorModeValue("gray.500", "white")}>
              {subTitle}
            </Text>
          )}
        </Stack>
        <Box my={6}>{children}</Box>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="secondary"
          leftWalletIcon={<BiLeftArrowAlt />}
          onClick={goBack}
        >
          Change Wallet
        </Button>

        {error?.message.includes(ConnectionError.rejectedConnection) && (
          <Button ml={4} onClick={tryAgain}>
            Try again
          </Button>
        )}

        {active && account && (
          <Button ml={4} onClick={closeModal}>
            View Dashboard
          </Button>
        )}

        {onContinue && (
          <Button ml={4} onClick={onContinue}>
            Continue
          </Button>
        )}
      </ModalFooter>
    </>
  )
}

export default WalletConnectionModalBase
