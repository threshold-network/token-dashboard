import { FC, useState } from "react"
import {
  Button,
  Stack,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  BodyLg,
  H5,
  BodyMd,
  Card,
  LabelMd,
  Badge,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import withBaseModal from "../withBaseModal"
import AuthorizationCard from "./AuthorizationCard"
import { useStakingState } from "../../../hooks/useStakingState"
import AppAuthorizationForm from "./AppAuthorizationForm"
import { tmpAppAuthData } from "../../../pages/Staking/tmp"

const AuthorizeStakingApplicationModal: FC<
  BaseModalProps & { stake: StakeData }
> = ({ stake, closeModal }) => {
  const handleSubmit = (vals: any) => {
    console.log("next", vals)
  }

  const [tbtcAuthorizationAmount, setTbtcAuthorizationAmount] = useState(
    stake?.totalInTStake
  )
  const [
    randomBeaconAuthorizationAmount,
    setAmountRandomBeaconAuthorizationAmount,
  ] = useState(stake?.totalInTStake)

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
          <BodyMd>Total Staked Balance</BodyMd>
          {/*<TokenBalance*/}
          {/*  tokenAmount={stake?.totalInTStake}*/}
          {/*  tokenSymbol="T"*/}
          {/*  withSymbol*/}
          {/*/>*/}

          <AppAuthorizationForm
            tbtcAuthorizationAmount={tbtcAuthorizationAmount}
            randomBeaconAuthorizationAmount={randomBeaconAuthorizationAmount}
            appsAuthData={tmpAppAuthData}
            handleSubmit={handleSubmit}
          />
        </Stack>
      </ModalBody>
    </>
  )
}

export default withBaseModal(AuthorizeStakingApplicationModal)
