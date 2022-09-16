import { FC } from "react"
import {
  BodyLg,
  Button,
  H5,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  List,
  ListItem,
  Image,
  Divider,
  HStack,
  BodySm,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import IncreaseAuthIcon from "../../../static/images/increase-auth.svg"
import { useIncreaseAuthorizationTransacion } from "../../../hooks/staking-applications"
import shortenAddress from "../../../utils/shortenAddress"
import { formatTokenAmount } from "../../../utils/formatAmount"
import withBaseModal from "../withBaseModal"
import { StakingAppName } from "../../../store/staking-applications"
import { BaseModalProps } from "../../../types"

export type AuthorizeAppsProps = BaseModalProps & {
  stakingProvider: string
  stakingAppName: StakingAppName
  increaseAmount: string
}

const IncreaseAuthorizationBase: FC<AuthorizeAppsProps> = ({
  stakingProvider,
  stakingAppName,
  increaseAmount,
  closeModal,
}) => {
  const { sendTransaction } = useIncreaseAuthorizationTransacion(stakingAppName)
  const onAuthorizeIncrease = () => {
    // TODO: Open success modal, probably we should open success modal in
    // `useIncreaseAuthorizationTransacion`.
    sendTransaction(stakingProvider, increaseAmount)
  }

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
        <Image src={IncreaseAuthIcon} mb="6" mx="auto" />
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
