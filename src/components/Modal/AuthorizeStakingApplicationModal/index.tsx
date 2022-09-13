import { FC, useState } from "react"
import {
  BodyLg,
  BodyMd,
  H5,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Stack,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import withBaseModal from "../withBaseModal"
import AppAuthorizationForm from "./AppAuthorizationForm"
import { tmpAppAuthData } from "../../../pages/Staking/tmp"

const AuthorizeStakingApplicationModal: FC<
  BaseModalProps & { stake: StakeData }
> = ({ stake, closeModal }) => {
  const handleSubmit = (vals: any) => {
    console.log("next", vals)
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
          <BodyMd>Total Staked Balance</BodyMd>
          {/*<TokenBalance*/}
          {/*  tokenAmount={stake?.totalInTStake}*/}
          {/*  tokenSymbol="T"*/}
          {/*  withSymbol*/}
          {/*/>*/}

          <AppAuthorizationForm
            stake={stake}
            appsAuthData={tmpAppAuthData}
            handleSubmit={handleSubmit}
          />
        </Stack>
      </ModalBody>
    </>
  )
}

export default withBaseModal(AuthorizeStakingApplicationModal)
