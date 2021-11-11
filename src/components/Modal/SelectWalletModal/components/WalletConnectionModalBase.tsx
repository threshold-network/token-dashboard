import React, { FC } from "react"
import {
  Box,
  Button,
  HStack,
  Icon,
  ModalBody,
  ModalFooter,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { BiLeftArrowAlt } from "react-icons/all"
import { useWeb3React } from "@web3-react/core"
import { WalletConnectionModalProps } from "../../../../types"
import { ConnectionError } from "../../../../enums"
import { Body2, H4 } from "../../../Typography"

interface Props extends WalletConnectionModalProps {
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
            <H4>{title}</H4>
          </HStack>
          {subTitle && (
            <Body2
              align="center"
              color={useColorModeValue("gray.500", "white")}
            >
              {subTitle}
            </Body2>
          )}
        </Stack>
        <Box my={6}>{children}</Box>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          leftIcon={<BiLeftArrowAlt />}
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
