import { FC, useMemo } from "react"
import {
  BodyLg,
  BodyMd,
  H5,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Stack,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import withBaseModal from "../withBaseModal"
import AuthorizationFormNewStaker, {
  FormValues,
} from "./AuthorizationFormNewStaker"
import { useStakingState } from "../../../hooks/useStakingState"
import TokenBalance from "../../TokenBalance"
import { useStakingAppMinAuthorizationAmount } from "../../../hooks/staking-applications"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"

const AuthorizeApplicationModalNewStaker: FC<
  BaseModalProps & { stake: StakeData }
> = () => {
  const { openModal } = useModal()

  const handleSubmit = (vals: FormValues) => {
    // TODO: This might need to be refactored into a multi-step modal that authorizes each app separately.
    openModal(ModalType.ConfirmAuthorizationDataNewStaker)
  }

  const { stakeAmount } = useStakingState()

  const tbtcMinAuthAmount = useStakingAppMinAuthorizationAmount("tbtc")

  const randomBeaconMinAuthAmount =
    useStakingAppMinAuthorizationAmount("randomBeacon")

  const tbtcInputConstraints = useMemo(
    () => ({
      min: tbtcMinAuthAmount,
      max: stakeAmount,
    }),
    [stakeAmount, tbtcMinAuthAmount]
  )

  const randomBeaconInputConstraints = useMemo(
    () => ({
      min: randomBeaconMinAuthAmount,
      max: stakeAmount,
    }),
    [stakeAmount, randomBeaconMinAuthAmount]
  )

  return (
    <>
      <ModalHeader>Authorize Apps</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5 mb={4}>
            Please authorize Threshold apps to use your stake to earn rewards
          </H5>
          <BodyLg>
            You can authorize 100% of your stake to all the apps and change this
            at any time.
          </BodyLg>
        </InfoBox>
        <Stack spacing={6}>
          <HStack justifyContent="space-between" mt={4}>
            <BodyMd>Total Staked Balance</BodyMd>
            <TokenBalance
              tokenAmount={stakeAmount}
              tokenSymbol="T"
              withSymbol
            />
          </HStack>
          <AuthorizationFormNewStaker
            tbtcInputConstraints={tbtcInputConstraints}
            randomBeaconInputConstraints={randomBeaconInputConstraints}
            onSubmitForm={handleSubmit}
          />
        </Stack>
      </ModalBody>
    </>
  )
}

export default withBaseModal(AuthorizeApplicationModalNewStaker)
