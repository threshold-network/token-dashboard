import { FC, useCallback } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { Body1, H5 } from "../../Typography"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink"
import StakingStats from "../../StakingStats"
import { useModal } from "../../../hooks/useModal"
import useUnstakeTransaction from "../../../web3/hooks/useUnstakeTransaction"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import { ModalType } from "../../../enums"
import withBaseModal from "../withBaseModal"

const UnstakeTModal: FC<
  BaseModalProps & { stake: StakeData; amountToUnstake: string }
> = ({ stake, amountToUnstake }) => {
  const { closeModal, openModal } = useModal()

  const onSuccess = useCallback(
    (tx) =>
      openModal(ModalType.UnstakeSuccess, {
        transactionHash: tx.hash,
        stake,
        unstakeAmount: amountToUnstake,
      }),
    [amountToUnstake, stake, openModal]
  )
  const { unstake } = useUnstakeTransaction(onSuccess)

  return (
    <>
      <ModalHeader>Unstake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <H5 mb={4}>You are about to unstake your tokens</H5>
            <Body1>
              You can partially or totally unstake depending on your needs.
            </Body1>
          </InfoBox>
          <StakingStats
            stakeAmount={amountToUnstake}
            amountText="Unstake Amount"
            stakingProvider={stake.stakingProvider}
            beneficiary={stake.beneficiary}
            authorizer={stake.authorizer}
          />
          <Alert status="warning">
            <AlertIcon alignSelf="center" />

            <AlertDescription color={useColorModeValue("gray.700", "gray.300")}>
              Take note! If you fully unstake you will not be able to use the
              same Operator Address for new stakes. This unstaked stake can be
              toppped up anytime you want.
            </AlertDescription>
          </Alert>
        </Stack>
        <StakingContractLearnMore mt="10" />
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={
            !amountToUnstake ||
            +amountToUnstake == 0 ||
            +amountToUnstake > +stake.tStake
          }
          onClick={() => {
            if (amountToUnstake) {
              unstake({
                stakingProvider: stake.stakingProvider,
                amount: amountToUnstake,
              })
            }
          }}
        >
          Unstake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(UnstakeTModal)
