import { FC, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
} from "@chakra-ui/react"
import { Body1, Body3, H5 } from "../../Typography"
import withBaseModal from "../withBaseModal"
import TokenBalanceInput from "../../TokenBalanceInput"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import ThresholdCircleBrand from "../../../static/icons/ThresholdCircleBrand"
import { ModalType } from "../../../enums"
import { StakeData } from "../../../types/staking"
import useUnstakeTransaction from "../../../web3/hooks/useUnstakeTransaction"

const UnstakeTModal: FC<BaseModalProps & { stake: StakeData }> = ({
  stake,
}) => {
  const { unstake } = useUnstakeTransaction((tx) =>
    openModal(ModalType.UnstakeSuccess, { transactionHash: tx.hash })
  )
  const { closeModal, openModal } = useModal()
  const [amountToUnstake, setAmountToUnstake] = useState<string | number>(0)

  return (
    <>
      <ModalHeader>Unstake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <Box borderRadius="md" bg="gray.50" p={6}>
            <H5 mb={4}>You are about to unstake your T</H5>
            <Body1>Lorem Ipsum about what unstaking means</Body1>
          </Box>
          <Alert status="warning">
            <AlertIcon />
            <AlertDescription>
              Some info about not using the same operator again:{" "}
              {stake.operator}
            </AlertDescription>
          </Alert>
          <Stack spacing={6} mb={6}>
            <Box>
              <TokenBalanceInput
                label={`T Amount`}
                amount={amountToUnstake}
                setAmount={setAmountToUnstake}
                max={stake.tStake}
                icon={ThresholdCircleBrand}
                mb={2}
              />
              <Body3>
                {formatTokenAmount(stake.tStake)} T available to unstake.
              </Body3>
            </Box>
          </Stack>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={+amountToUnstake == 0 || +amountToUnstake > +stake.tStake}
          onClick={() =>
            unstake({ operator: stake.operator, amount: amountToUnstake })
          }
        >
          Unstake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(UnstakeTModal)
