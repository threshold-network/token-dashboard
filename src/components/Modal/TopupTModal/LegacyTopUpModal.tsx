import { FC } from "react"
import {
  Button,
  ListItem,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  UnorderedList,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  Tabs,
  useColorModeValue,
  Alert,
  AlertDescription,
  AlertIcon,
  Link,
  Divider,
} from "@chakra-ui/react"
import { Body3, H5 } from "../../Typography"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import {
  ExternalHref,
  ModalType,
  StakeType,
  Token,
  TopUpType,
} from "../../../enums"
import withBaseModal from "../withBaseModal"
import { TokenAmountForm } from "../../Forms"
import { useTokenBalance } from "../../../hooks/useTokenBalance"
import { StakingContractLearnMore } from "../../ExternalLink"
import { useModal } from "../../../hooks/useModal"
import { StakeData } from "../../../types/staking"

const stakeTypeToDaapHref: Record<StakeType.KEEP | StakeType.NU, ExternalHref> =
  {
    [StakeType.KEEP]: ExternalHref.keepDapp,
    [StakeType.NU]: ExternalHref.nuDapp,
  }

const LegacyTopUpModal: FC<BaseModalProps & { stake: StakeData }> = ({
  closeModal,
  stake,
}) => {
  const tBalance = useTokenBalance(Token.T)
  const { openModal } = useModal()
  // TODO find a solution to style bullets with chakra theme.
  const bulletColor = useColorModeValue("gray.700", "gray.300")
  const bulletColorStyle = { "::marker": { color: bulletColor } }

  const onSubmitForm = (tokenAmount: string | number) => {
    openModal(ModalType.TopupT, {
      stake,
      amountTopUp: tokenAmount,
      topUpType: TopUpType.NATIVE,
    })
  }

  return (
    <>
      <ModalHeader>Topping up Stake</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5 mb={4} color={useColorModeValue("gray.800", "white")}>
            This is a Legacy Stake
          </H5>
          <Body3 mb="6">Topping up a Legacy Stake can be done:</Body3>
          <UnorderedList spacing="6">
            <ListItem sx={bulletColorStyle}>
              <Body3>
                You can top-up your legacy stake with liquid T tokens in this
                modal
              </Body3>
            </ListItem>
            <ListItem sx={bulletColorStyle}>
              <Body3>
                You can top-up your legacy stake with legacy tokens in the
                legacy dashboard. After you do the top-up you will be required
                to confirm your legacy top-up in the Threshold dashboard
              </Body3>
            </ListItem>
          </UnorderedList>
        </InfoBox>
        <Tabs isFitted>
          <TabList mb="8">
            <Tab>Top-up T</Tab>

            {stake.stakeType !== StakeType.T && <Tab>Top-up legacy stake</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <TokenAmountForm
                onSubmitForm={onSubmitForm}
                label="Top-up amount"
                submitButtonText="Top-up"
                maxTokenAmount={tBalance}
                shouldDisplayMaxAmountInLabel
              />
            </TabPanel>
            {stake.stakeType !== StakeType.T && (
              <TabPanel>
                <Button
                  as={Link}
                  isExternal
                  href={stakeTypeToDaapHref[stake.stakeType]}
                  isFullWidth
                  mb="3"
                >
                  Top-up on the Legacy Dashboard
                </Button>
                <Alert status="warning">
                  <AlertIcon alignSelf="center" />
                  <AlertDescription
                    color={useColorModeValue("gray.700", "gray.300")}
                  >
                    After you topped-up in the legacy dashboad you will need to
                    confirm your top-up in the Threshold Dashboard. This action
                    will require one transaction.
                  </AlertDescription>
                </Alert>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
        <StakingContractLearnMore mt="1.25rem !important" />
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

export default withBaseModal(LegacyTopUpModal)
