import React, { FC, useEffect } from "react"
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
import { BaseModalProps } from "../../../../types"
import { BodyMd, H4 } from "@threshold-network/components"
import { AbstractConnector } from "../../../../web3/connectors"

interface Props extends BaseModalProps {
  WalletIcon: any
  title: string
  subTitle?: string
  tryAgain?: () => void
  onContinue?: () => void
  goBack: () => void
  connector?: AbstractConnector
  /**
   * This is required for some of the providers (for example WalletConnect v2),
   * because they have their own modal that is being opened. In that case we
   * can't display our loading modal because it has larger z-index than
   * provider's one and it's too problematic to change that.
   *
   */
  shouldForceCloseModal?: boolean
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
  connector,
  shouldForceCloseModal,
}) => {
  const { activate, active, account } = useWeb3React()

  useEffect(() => {
    if (shouldForceCloseModal) closeModal()
    if (!connector) return

    activate(connector)
  }, [activate, connector, shouldForceCloseModal, closeModal])

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
            <BodyMd
              align="center"
              color={useColorModeValue("gray.500", "white")}
            >
              {subTitle}
            </BodyMd>
          )}
        </Stack>
        <Box my={6}>{children}</Box>
      </ModalBody>
      <ModalFooter display="flex" justifyContent="space-between">
        <Button
          variant="outline"
          leftIcon={<BiLeftArrowAlt />}
          onClick={goBack}
        >
          Change Wallet
        </Button>

        {tryAgain && !active && (
          <Button ml={4} onClick={tryAgain}>
            Try Again
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
