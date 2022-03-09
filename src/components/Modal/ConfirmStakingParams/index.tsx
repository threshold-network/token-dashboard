import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Divider,
  useDisclosure,
  useColorModeValue,
  Collapse,
  Flex,
} from "@chakra-ui/react"
import { BsChevronDown, BsChevronUp } from "react-icons/all"
import { Body1, Body2, Body3, H5 } from "../../Typography"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import AdvancedParamsForm from "./AdvancedParamsForm"
import { useStakingState } from "../../../hooks/useStakingState"
import { useStakeTransaction } from "../../../web3/hooks/useStakeTransaction"
import { ModalType } from "../../../enums"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink"
import StakingStats from "../../StakingStats"

const ConfirmStakingParamsModal: FC<
  BaseModalProps & { stakeAmount: string }
> = ({ stakeAmount }) => {
  const { closeModal, openModal } = useModal()
  const { account } = useWeb3React()
  const { stakingProvider, beneficiary, authorizer, updateState } =
    useStakingState()

  const { isOpen, onToggle } = useDisclosure()

  // stake transaction, opens success modal on success callback
  const { stake } = useStakeTransaction((tx) =>
    openModal(ModalType.StakeSuccess, {
      transactionHash: tx.hash,
    })
  )

  const onSubmit = ({
    stakingProvider,
    beneficiary,
    authorizer,
  }: {
    stakingProvider: string
    beneficiary: string
    authorizer: string
  }) => stake({ stakingProvider, beneficiary, authorizer, amount: stakeAmount })

  return (
    <>
      <ModalHeader>Stake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5 mb={4}>
            You are about to make a deposit into the T Staking Contract
          </H5>
          <Body1>
            Staking uses an ApproveAndCall function which requires one
            confirmation transaction.
          </Body1>
        </InfoBox>
        <StakingStats
          {...{
            stakeAmount,
            beneficiary: account as string,
            stakingProvider: account as string,
            authorizer: account as string,
          }}
        />
        <Body3 color="gray.500" mt="10">
          Provider, Beneficiary, and Authorizer addresses are currently set to
          your wallet address.
        </Body3>
        <Body2 textAlign="center" mt="4" mb="6">
          {account}
        </Body2>
        <Flex direction="column">
          <Button
            variant="link"
            color={useColorModeValue("brand.500", "white")}
            onClick={onToggle}
            mb={3}
            alignSelf="flex-end"
            rightIcon={isOpen ? <BsChevronUp /> : <BsChevronDown />}
          >
            Customize these addresses
          </Button>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <AdvancedParamsForm
            formId="advanced-staking-params-form"
            initialAddress={account as string}
            onSubmitForm={onSubmit}
          />
        </Collapse>

        <StakingContractLearnMore textAlign="center" mt="8" />
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button type="submit" form="advanced-staking-params-form">
          Stake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(ConfirmStakingParamsModal)
