import { FC, useMemo } from "react"
import {
  BodyLg,
  BodyMd,
  H5,
  HStack,
  ModalBody,
  ModalHeader,
  Stack,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import NewStakerAuthorizationForm, {
  FormValues,
} from "./NewStakerAuthorizationForm"
import { useStakingState } from "../../../hooks/useStakingState"
import TokenBalance from "../../TokenBalance"
import {
  useStakingApplicationAddress,
  useStakingAppMinAuthorizationAmount,
} from "../../../hooks/staking-applications"
import { ModalType } from "../../../enums"
import { useModal } from "../../../hooks/useModal"
import ModalCloseButton from "../ModalCloseButton"

const NewStakerAuthorizeStakingApplicationModal: FC<BaseModalProps> = () => {
  const { openModal } = useModal()

  const { stakeAmount, stakingProvider } = useStakingState()

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

  const tbtcAppAddress = useStakingApplicationAddress("tbtc")
  const randomBeaconAppAddress = useStakingApplicationAddress("randomBeacon")

  const handleSubmit = (vals: FormValues) => {
    const tbtcAppInfo = {
      appName: "tbtc",
      address: tbtcAppAddress,
      authorizationAmount: vals.tbtcAmountToAuthorize,
    }

    const randomBeaconAppInfo = {
      appName: "randomBeacon",
      address: randomBeaconAppAddress,
      authorizationAmount: vals.randomBeaconAmountToAuthorize,
    }

    const applications = [
      vals.isRandomBeaconChecked ? randomBeaconAppInfo : null,
      vals.isTbtcChecked ? tbtcAppInfo : null,
    ].filter(Boolean)

    openModal(ModalType.AuthorizeStakingApps, {
      stakingProvider: stakingProvider,
      totalInTStake: stakeAmount,
      applications,
    })
  }

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
          <NewStakerAuthorizationForm
            tbtcInputConstraints={tbtcInputConstraints}
            randomBeaconInputConstraints={randomBeaconInputConstraints}
            onSubmitForm={handleSubmit}
          />
        </Stack>
      </ModalBody>
    </>
  )
}

export default withBaseModal(NewStakerAuthorizeStakingApplicationModal)
