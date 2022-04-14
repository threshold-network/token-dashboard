import { FC, useCallback } from "react"
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
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
import { SimpleTokenAmountForm } from "../../Forms"
import KeepCircleBrand from "../../../static/icons/KeepCircleBrand"
import NuCircleBrand from "../../..//static/icons/NuCircleBrand"
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
        <InfoBox variant="modal" mb="6">
          <H5 mb={4}>This is a Legacy Stake</H5>
          <Body3>Unstaking a Legacy Stake can be done:</Body3>
          <UnorderedList>
            <ListItem mt="4">
              <Body3>
                Partial by unstaking your legacy tokens and your T tokens in
                separate transactions. Legacy tokens staked can be unstaked only
                in full amount.
              </Body3>
            </ListItem>
            <ListItem mt="4">
              <Body3>
                Total by unstaking the whole amount of T and legacy tokens
                staked, in one transaction.
              </Body3>
            </ListItem>
          </UnorderedList>
        </InfoBox>
        <Tabs isFitted>
          <TabList mb="8">
            <Tab>Unstake T</Tab>
            <Tab>Unstake legacy stake</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SimpleTokenAmountForm
                onSubmitForm={(tokenAmount) => {
                  console.log("test")
                }}
                label="Unstake amount"
                submitButtonText="Unstake"
                maxTokenAmount="100"
              />
            </TabPanel>
            <TabPanel>
              <SimpleTokenAmountForm
                onSubmitForm={(tokenAmount) => {
                  console.log("test")
                }}
                label="Unstake amount"
                submitButtonText="Unstake"
                maxTokenAmount="100"
                icon={KeepCircleBrand}
                helperText="The legacy tokens can be only unstaked in full amount"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Divider>
          <DividerCenterElement>
            <Label3>OR</Label3>
          </DividerCenterElement>
        </Divider>
        <Button variant="outline" isFullWidth>
          Unstake all
        </Button>
        <StakingContractLearnMore mt="7" />
        <Divider mb={0} />
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
