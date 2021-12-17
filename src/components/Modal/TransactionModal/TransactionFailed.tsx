import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  HStack,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  useDisclosure,
  ModalFooter,
  Button,
} from "@chakra-ui/react"
import TransactionError from "../../../static/icons/TransactionError"
import { Body3 } from "../../Typography"
import { ExternalLink } from "../../../enums"
import { BaseModalProps } from "../../../types"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import withBaseModal from "../withBaseModal"

interface TransactionFailedProps extends BaseModalProps {
  transactionHash?: string
  error: string
  isExpandableError?: boolean
}

const TransactionFailed: FC<TransactionFailedProps> = ({
  error,
  isExpandableError,
  closeModal,
  transactionHash,
}) => {
  const { isOpen, onToggle } = useDisclosure()

  const errorTitle = "Error Text"

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
                    <Body3>{errorTitle}</Body3>
                    <Body3
                      onClick={onToggle}
                      ml={4}
                      textDecoration="underline"
                      cursor="pointer"
                    >
                      Show {isOpen ? "Less" : "More"}
                    </Body3>
                  </HStack>
                ) : (
                  error
                )}
              </AlertTitle>
            </HStack>
            {isOpen && (
              <AlertDescription>
                <Body3>{error}</Body3>
                <Link
                  textDecoration="underline"
                  bold="md"
                  mt={8}
                  href={ExternalLink.THRESHOLD_DISCORD}
                  target="_blank"
                >
                  Get help on discord
                </Link>
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
          <Body3>
            <ViewInBlockExplorer
              id={transactionHash}
              type={ExplorerDataType.TRANSACTION}
              text="View"
            />
            transaction on Etherscan
          </Body3>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TransactionFailed)
