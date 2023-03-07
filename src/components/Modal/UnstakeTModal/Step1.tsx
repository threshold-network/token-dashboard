import { FC, useState, useMemo } from "react"
import {
  BodySm,
  H5,
  LabelSm,
  LineDivider,
  LineDividerCenterElement,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UnorderedList,
  ListItem,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  BodyLg,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../Link"
import { TokenAmountForm } from "../../Forms"
import KeepCircleBrand from "../../../static/icons/KeepCircleBrand"
import NuCircleBrand from "../../..//static/icons/NuCircleBrand"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps, UpgredableToken } from "../../../types"
import { StakeData } from "../../../types/staking"
import { ModalType, Token, UnstakeType } from "../../../enums"
import withBaseModal from "../withBaseModal"
import { DeauthorizeInfo } from "./DeauthorizeInfo"
import { useAppSelector } from "../../../hooks/store"
import { selectAvailableAmountToUnstakeByStakingProvider } from "../../../store/staking"
import ModalCloseButton from "../ModalCloseButton"
import { UnstakingFormLabel } from "../../UnstakingFormLabel"

const UnstakeTModal: FC<BaseModalProps & { stake: StakeData }> = ({
  stake,
  closeModal,
}) => {
  const { openModal } = useModal()
  const [unstakeType, setUnstakeType] = useState(UnstakeType.NATIVE)

  const onSubmitForm = (tokenAmount: string) => {
    openModal(ModalType.UnstakeTStep2, {
      stake,
      amountToUnstake: tokenAmount,
      unstakeType,
    })
  }

  const onUnstakeAllBtn = () => {
    openModal(ModalType.UnstakeTStep2, {
      stake,
      amountToUnstake: "0",
      unstakeType: UnstakeType.ALL,
    })
  }

  const hasNuStake = stake.nuInTStake !== "0"
  const hasKeepStake = stake.keepInTStake !== "0"
  const hasLegacyStake = hasNuStake || hasKeepStake

  const getLegacyTabTitle = (token: UpgredableToken) => {
    return `Unstake legacy ${hasKeepStake && hasNuStake ? token : ""} stake`
  }

  const unstakeAllBtnHelperText = useMemo(() => {
    const suffix =
      hasNuStake && hasKeepStake ? "KEEP + NU" : hasKeepStake ? "KEEP" : "NU"
    return `Unstakes max of both native tokens and legacy tokens (${suffix} + T)`
  }, [hasNuStake, hasKeepStake])

  const availableAmountToUnstake = useAppSelector((state) =>
    selectAvailableAmountToUnstakeByStakingProvider(
      state,
      stake.stakingProvider
    )
  )

  return (
    <>
      <ModalHeader>Unstake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5 mb={4}>
            {hasLegacyStake
              ? "This is a Legacy Stake"
              : "You are about unstake your tokens"}
          </H5>
          {hasLegacyStake ? (
            <>
              <BodySm>Unstaking a Legacy Stake can be done:</BodySm>
              <UnorderedList>
                <ListItem mt="4">
                  <BodySm>
                    Partial by unstaking your legacy tokens and your T tokens in
                    separate transactions. Legacy tokens staked can be unstaked
                    only in full amount.
                  </BodySm>
                </ListItem>
                <ListItem mt="4">
                  <BodySm>
                    Total by unstaking the whole amount of T and legacy tokens
                    staked, in one transaction.
                  </BodySm>
                </ListItem>
              </UnorderedList>
            </>
          ) : (
            <BodyLg>
              You can partially or totally unstake depending on your needs.
            </BodyLg>
          )}
          <DeauthorizeInfo stakingProvider={stake.stakingProvider} />
        </InfoBox>
        <Tabs isFitted>
          <TabList mb="8">
            <Tab onClick={() => setUnstakeType(UnstakeType.NATIVE)}>
              Unstake T
            </Tab>
            {hasKeepStake && (
              <Tab onClick={() => setUnstakeType(UnstakeType.LEGACY_KEEP)}>
                {getLegacyTabTitle(Token.Keep)}
              </Tab>
            )}
            {hasNuStake && (
              <Tab onClick={() => setUnstakeType(UnstakeType.LEGACY_NU)}>
                {getLegacyTabTitle(Token.Nu)}
              </Tab>
            )}
          </TabList>
          <TabPanels>
            <TabPanel>
              <TokenAmountForm
                onSubmitForm={onSubmitForm}
                label={
                  <UnstakingFormLabel
                    maxTokenAmount={availableAmountToUnstake.t}
                    stakingProvider={stake.stakingProvider}
                    label="Unstake amount"
                    hasAuthorizedApps={!availableAmountToUnstake.canUnstakeAll}
                  />
                }
                submitButtonText="Unstake"
                maxTokenAmount={availableAmountToUnstake.t}
              />
            </TabPanel>
            {hasKeepStake && (
              <TabPanel>
                <TokenAmountForm
                  onSubmitForm={onSubmitForm}
                  initialTokenAmount={stake.keepInTStake}
                  label={
                    <UnstakingFormLabel
                      maxTokenAmount={availableAmountToUnstake.keepInT}
                      stakingProvider={stake.stakingProvider}
                      label="Unstake amount"
                      hasAuthorizedApps={
                        !availableAmountToUnstake.canUnstakeAll
                      }
                    />
                  }
                  submitButtonText="Unstake"
                  maxTokenAmount={availableAmountToUnstake.keepInT}
                  icon={KeepCircleBrand}
                  helperText="The legacy tokens can be only unstaked in full amount"
                  isDisabled
                />
              </TabPanel>
            )}
            {hasNuStake && (
              <TabPanel>
                <TokenAmountForm
                  onSubmitForm={onSubmitForm}
                  label={
                    <UnstakingFormLabel
                      maxTokenAmount={availableAmountToUnstake.nuInT}
                      stakingProvider={stake.stakingProvider}
                      label="Unstake amount"
                      hasAuthorizedApps={
                        !availableAmountToUnstake.canUnstakeAll
                      }
                    />
                  }
                  submitButtonText="Unstake"
                  maxTokenAmount={availableAmountToUnstake.nuInT}
                  icon={NuCircleBrand}
                />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
        {hasLegacyStake && (
          <>
            <LineDivider>
              <LineDividerCenterElement>
                <LabelSm>OR</LabelSm>
              </LineDividerCenterElement>
            </LineDivider>
            <Button
              variant="outline"
              isFullWidth
              onClick={onUnstakeAllBtn}
              isDisabled={!availableAmountToUnstake.canUnstakeAll}
            >
              Unstake All
            </Button>
            <BodySm mt="2">{unstakeAllBtnHelperText}</BodySm>
          </>
        )}
        <StakingContractLearnMore mt="7" />
        <LineDivider mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(UnstakeTModal)
