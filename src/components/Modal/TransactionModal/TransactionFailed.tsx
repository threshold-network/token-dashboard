import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@chakra-ui/react"
import TransactionError from "../../../static/icons/TransactionError"
import { BodySm } from "@threshold-network/components"
import { ExternalHref } from "../../../enums"
import { BaseModalProps } from "../../../types"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import withBaseModal from "../withBaseModal"
import ExternalLink from "../../ExternalLink"

interface TransactionFailedProps extends BaseModalProps {
  transactionHash?: string
  error: Error
  isExpandableError?: boolean
}

const TransactionFailed: FC<TransactionFailedProps> = ({
  error,
  isExpandableError,
  closeModal,
  transactionHash,
}) => {
  const { isOpen, onToggle } = useDisclosure()

  const errorTitle = error?.message || error.name || "Error"

  return (
    <>
      <ModalHeader>Error</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box mb={6}>
          <Alert
            status="error"
            mb={4}
            zIndex={999}
            height={isOpen ? "280px" : undefined}
            flexDirection="column"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": {
                width: "4px",
                marginRight: "4px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "red",
                borderRadius: "24px",
              },
            }}
          >
            <HStack alignSelf="flex-start" mb={isOpen ? 6 : 0}>
              <AlertIcon />
              <AlertTitle display="flex">
                {isExpandableError ? (
                  <HStack>
                    <BodySm>{errorTitle}</BodySm>
                    <BodySm
                      onClick={onToggle}
                      ml={4}
                      textDecoration="underline"
                      cursor="pointer"
                      minW="80px"
                    >
                      Show {isOpen ? "Less" : "More"}
                    </BodySm>
                  </HStack>
                ) : (
                  errorTitle
                )}
              </AlertTitle>
            </HStack>
            {isOpen && (
              <AlertDescription maxWidth="100%">
                <BodySm mb={8}>{error?.stack?.toString()}</BodySm>
                <ExternalLink
                  href={ExternalHref.thresholdDiscord}
                  text="Get help on discord"
                  fontWeight="bold"
                />
              </AlertDescription>
            )}
          </Alert>
          {!isOpen && (
            <Box borderRadius="md" bg="gray.50" pt={12} pb={8} mb={8}>
              <HStack position="relative" justify="center" mb={8}>
                <TransactionError boxSize="120px" zIndex={0} />
              </HStack>
            </Box>
          )}
        </Box>
        {transactionHash && (
          <BodySm>
            <ViewInBlockExplorer
              id={transactionHash}
              type={ExplorerDataType.TRANSACTION}
              text="View"
            />
            transaction on Etherscan
          </BodySm>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TransactionFailed)
