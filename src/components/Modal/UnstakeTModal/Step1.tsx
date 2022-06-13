import { FC, useState, useMemo } from "react"
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  UnorderedList,
  ListItem,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
} from "@chakra-ui/react"
import { Divider, DividerCenterElement } from "../../Divider"
import { Body3, H5, Label3 } from "../../Typography"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink"
import { TokenAmountForm } from "../../Forms"
import KeepCircleBrand from "../../../static/icons/KeepCircleBrand"
import NuCircleBrand from "../../..//static/icons/NuCircleBrand"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps, UpgredableToken } from "../../../types"
import { StakeData } from "../../../types/staking"
import { ModalType, Token, UnstakeType } from "../../../enums"
import withBaseModal from "../withBaseModal"

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
              <Body3>Unstaking a Legacy Stake can be done:</Body3>
              <UnorderedList>
                <ListItem mt="4">
                  <Body3>
                    Partial by unstaking your legacy tokens and your T tokens in
                    separate transactions. Legacy tokens staked can be unstaked
                    only in full amount.
                  </Body3>
                </ListItem>
                <ListItem mt="4">
                  <Body3>
                    Total by unstaking the whole amount of T and legacy tokens
                    staked, in one transaction.
                  </Body3>
                </ListItem>
              </UnorderedList>
            </>
          ) : (
            <Body3>
              You can partially or totally unstake depending on your needs.
            </Body3>
          )}
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
                label="Unstake amount"
                submitButtonText="Unstake"
                maxTokenAmount={stake.tStake}
                shouldDisplayMaxAmountInLabel
              />
            </TabPanel>
            {hasKeepStake && (
              <TabPanel>
                <TokenAmountForm
                  onSubmitForm={onSubmitForm}
                  initialTokenAmount={stake.keepInTStake}
                  label="Unstake amount"
                  submitButtonText="Unstake"
                  maxTokenAmount={stake.keepInTStake}
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
                  label="Unstake amount"
                  submitButtonText="Unstake"
                  maxTokenAmount={stake.nuInTStake}
                  icon={NuCircleBrand}
                  shouldDisplayMaxAmountInLabel
                />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
        {hasLegacyStake && (
          <>
            <Divider>
              <DividerCenterElement>
                <Label3>OR</Label3>
              </DividerCenterElement>
            </Divider>
            <Button variant="outline" isFullWidth onClick={onUnstakeAllBtn}>
              Unstake All
            </Button>
            <Body3 mt="2">{unstakeAllBtnHelperText}</Body3>
          </>
        )}
        <StakingContractLearnMore mt="7" />
        <Divider mt="4" />
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
