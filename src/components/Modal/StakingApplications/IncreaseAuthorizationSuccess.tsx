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

export type IncreaseAuthorizationSuccessProps = BaseModalProps & {
  stakingProvider: string
  txHash: string
  increaseAmount: string
}

const IncreaseAuthorizationSuccessBase: FC<
  IncreaseAuthorizationSuccessProps
> = ({ stakingProvider, txHash, increaseAmount, closeModal }) => {
  return (
    <>
      <ModalHeader>Increase Successful</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Alert status="success" mb={4}>
          <AlertIcon />
          Your authorization increase was successful!
        </Alert>
        <List spacing="2.5" my="6">
          <ListItem>
            <HStack justifyContent="space-between">
              <BodySm>Increase Amount</BodySm>
              <BodySm>{formatTokenAmount(increaseAmount)} T</BodySm>
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

export const IncreaseAuthorizationSuccess = withBaseModal(
  IncreaseAuthorizationSuccessBase
)
