import { FC } from "react"
import {
  HStack,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  List,
  ListItem,
  Alert,
  AlertIcon,
  BodySm,
  Divider,
} from "@threshold-network/components"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import withBaseModal from "../withBaseModal"
import shortenAddress from "../../../utils/shortenAddress"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { BaseModalProps } from "../../../types"
import ModalCloseButton from "../ModalCloseButton"

export type DeauthorizationCompletedProps = BaseModalProps & {
  stakingProvider: string
  txHash: string
  decreaseAmount: string
}

// TODO: revisit because we have the same layout for `AuthorizationIncreased`
// success modal. Should we create a new layout for success modal?
const DeauthorizationCompletedBase: FC<DeauthorizationCompletedProps> = ({
  stakingProvider,
  txHash,
  decreaseAmount,
  closeModal,
}) => {
  return (
    <>
      <ModalHeader>Deauthorization Successful</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Alert status="success" mb={4}>
          <AlertIcon />
          Your deauthorization was successful!
        </Alert>
        <List spacing="2.5" my="6">
          <ListItem>
            <HStack justifyContent="space-between">
              <BodySm>Decrease Amount</BodySm>
              <BodySm>{formatTokenAmount(decreaseAmount)} T</BodySm>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack justifyContent="space-between">
              <BodySm>Provider Address</BodySm>
              <BodySm>{shortenAddress(stakingProvider)}</BodySm>
            </HStack>
          </ListItem>
        </List>
        <BodySm align="center">
          <ViewInBlockExplorer
            text="View"
            id={txHash}
            type={ExplorerDataType.TRANSACTION}
          />{" "}
          transaction on Etherscan
        </BodySm>
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export const DeauthorizationCompleted = withBaseModal(
  DeauthorizationCompletedBase
)
