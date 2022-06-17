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
import { BodyLg, H5 } from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink"
import StakingStats from "../../StakingStats"
import { useModal } from "../../../hooks/useModal"
import useUnstakeTransaction from "../../../web3/hooks/useUnstakeTransaction"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import { ModalType, UnstakeType } from "../../../enums"
import withBaseModal from "../withBaseModal"

const UnstakeTModal: FC<
  BaseModalProps & {
    stake: StakeData
    amountToUnstake: string
    unstakeType: UnstakeType
  }
> = ({ stake, amountToUnstake, unstakeType, closeModal }) => {
  const { openModal } = useModal()
  const _amountToUnstake =
    unstakeType === UnstakeType.ALL
      ? stake.totalInTStake
      : unstakeType === UnstakeType.LEGACY_KEEP
      ? stake.keepInTStake
      : amountToUnstake

  const onSuccess = useCallback(
    (tx) =>
      openModal(ModalType.UnstakeSuccess, {
        transactionHash: tx.hash,
        stake,
        unstakeAmount: _amountToUnstake,
        unstakeType,
      }),
    [amountToUnstake, stake, openModal, unstakeType]
  )
  const { unstake } = useUnstakeTransaction(unstakeType, onSuccess)

  const hasNuStake = stake.nuInTStake !== "0"
  const hasKeepStake = stake.keepInTStake !== "0"

  const getStatsAmountText = () => {
    let suffix = ""
    if (unstakeType === UnstakeType.ALL) {
      const keep = hasKeepStake ? "KEEP + " : ""
      const nu = hasNuStake ? "NU + " : ""
      suffix = ` (${keep}${nu}T)`
    } else if (
      unstakeType === UnstakeType.LEGACY_KEEP ||
      unstakeType === UnstakeType.LEGACY_NU
    ) {
      const token = hasKeepStake ? "KEEP" : "NU"
      suffix = ` (${token} stake in T)`
    }
    return `Unstake Amount${suffix}`
  }

  return (
    <>
      <ModalHeader>Unstake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <H5 mb={4}>You are about to unstake your tokens</H5>
            <BodyLg>
              You can partially or totally unstake depending on your needs.
            </BodyLg>
          </InfoBox>
          <StakingStats
            stakeAmount={_amountToUnstake}
            amountText={getStatsAmountText()}
            stakingProvider={stake.stakingProvider}
            beneficiary={stake.beneficiary}
            authorizer={stake.authorizer}
          />
          <Alert status="warning">
            <AlertIcon alignSelf="center" />

            <AlertDescription color={useColorModeValue("gray.700", "gray.300")}>
              Take note! If you fully unstake you will not be able to use the
              same Staking Provider Address for new stakes. This unstaked stake
              can be topped up anytime you want.
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
          onClick={() => {
            unstake({
              stakingProvider: stake.stakingProvider,
              amount: amountToUnstake,
            })
          }}
        >
          Unstake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(UnstakeTModal)
