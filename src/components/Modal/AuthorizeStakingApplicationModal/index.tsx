import { FC, useState, useMemo } from "react"
import {
  Button,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  BodyLg,
  H5,
  BodyMd,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import withBaseModal from "../withBaseModal"
import AuthorizationCard from "./AuthorizationCard"
import TokenBalance from "../../TokenBalance"

const AuthorizeStakingApplicationModal: FC<
  BaseModalProps & { stake: StakeData }
> = ({ stake, closeModal }) => {
  const handleSubmit = () => {
    console.log("next")
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

        <HStack>
          <BodyMd>Total Staked Balance</BodyMd>
          <TokenBalance
            tokenAmount={stake?.totalInTStake}
            tokenSymbol="T"
            withSymbol
          />
        </HStack>

        <AuthorizationCard
          appAuthData={{
            label: "idk",
            isAuthorized: false,
            percentage: 100,
            isAuthRequired: true,
          }}
          isSelected
          onCheckboxClick={() => {}}
          maxAuthAmount={stake?.totalInTStake}
          minAuthAmount={"1"}
        />
        <AuthorizationCard
          appAuthData={{
            label: "idk",
            isAuthorized: false,
            percentage: 100,
            isAuthRequired: true,
          }}
          isSelected
          onCheckboxClick={() => {}}
          maxAuthAmount={stake?.totalInTStake}
          minAuthAmount={"1"}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Authorize Selected Apps</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(AuthorizeStakingApplicationModal)
