import { FC, useCallback } from "react"
import { ContractTransaction } from "ethers"
import {
  BodyLg,
  Button,
  H5,
  ModalBody,
  ModalFooter,
  ModalHeader,
  List,
  ListItem,
  Divider,
  HStack,
  BodySm,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { useIncreaseAuthorizationTransaction } from "../../../hooks/staking-applications"
import shortenAddress from "../../../utils/shortenAddress"
import { formatTokenAmount } from "../../../utils/formatAmount"
import withBaseModal from "../withBaseModal"
import { StakingAppName } from "../../../store/staking-applications"
import { BaseModalProps } from "../../../types"
import { ModalType } from "../../../enums"
import { useModal } from "../../../hooks/useModal"
import StakingApplicationOperationIcon from "../../StakingApplicationOperationIcon"
import ModalCloseButton from "../ModalCloseButton"

export type IncreaseAuthorizationProps = BaseModalProps & {
  stakingProvider: string
  stakingAppName: StakingAppName
  increaseAmount: string
}

const IncreaseAuthorizationBase: FC<IncreaseAuthorizationProps> = ({
  stakingProvider,
  stakingAppName,
  increaseAmount,
  closeModal,
}) => {
  const { openModal } = useModal()
  const onSuccess = useCallback(
    (tx: ContractTransaction) => {
      openModal(ModalType.IncreaseAuthorizationSuccess, {
        txHash: tx.hash,
        stakingProvider,
        increaseAmount,
      })
    },
    [openModal, stakingProvider, increaseAmount]
  )
  const { sendTransaction } = useIncreaseAuthorizationTransaction(
    stakingAppName,
    onSuccess
  )

  const onAuthorizeIncrease = useCallback(() => {
    sendTransaction(stakingProvider, increaseAmount)
  }, [sendTransaction, stakingProvider, increaseAmount, onSuccess])

  return (
    <>
      <ModalHeader>Authorize Increase</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6" mt="0">
          <H5>You are about to increase your authorization.</H5>
          <BodyLg mt="4">
            This will require 1 transaction. You can adjust the authorization
            amount at any time.
          </BodyLg>
        </InfoBox>
        <StakingApplicationOperationIcon
          stakingApplication={stakingAppName}
          operation="increase"
          w="88px"
          h="88px"
          mb="6"
          mx="auto"
        />
        <Divider />
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
        <Divider />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button mr={2} onClick={onAuthorizeIncrease}>
          Authorize Increase
        </Button>
      </ModalFooter>
    </>
  )
}

export const IncreaseAuthorization = withBaseModal(IncreaseAuthorizationBase)
