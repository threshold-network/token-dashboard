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
import {
  BodySm,
  H5,
  LabelSm,
  LineDivider,
  LineDividerCenterElement,
} from "@threshold-network/component"
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
            <BodySm>
              You can partially or totally unstake depending on your needs.
            </BodySm>
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
            <LineDivider>
              <LineDividerCenterElement>
                <LabelSm>OR</LabelSm>
              </LineDividerCenterElement>
            </LineDivider>
            <Button variant="outline" isFullWidth onClick={onUnstakeAllBtn}>
              Unstake all
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
