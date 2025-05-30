import {
  ModalBody,
  ModalFooter,
  ModalHeader,
  BodyLg,
  Button,
  Checkbox,
  BodyMd,
  Box,
  H5,
} from "@threshold-network/components"
import { BaseModalProps } from "../../../types/modal"
import { FC, useState, ChangeEvent } from "react"
import ModalCloseButton from "../ModalCloseButton"
import withBaseModal from "../withBaseModal"
import { useAppDispatch } from "../../../hooks/store"
import { tbtcSlice } from "../../../store/tbtc/tbtcSlice"
import InfoBox from "../../InfoBox"

interface FirstDepositWarningModalProps extends BaseModalProps {}

const FirstDepositWarningModalBase: FC<FirstDepositWarningModalProps> = ({
  closeModal,
}) => {
  const [isChecked, setIsChecked] = useState(false)
  const dispatch = useAppDispatch()

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked)
  }

  const handleConfirm = () => {
    dispatch(tbtcSlice.actions.setFirstDepositWarningConfirmed())
    closeModal()
  }

  return (
    <>
      <ModalHeader>Warning: First Deposit Amount</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5 mb="4">
            The first minting deposit should be exactly the minimum deposit
            amount of 0.01 BTC.
          </H5>
          <BodyLg my="2">
            The system won't recognize initial deposits different than 0.01 BTC
            for the first minting deposit, putting it at risk of not being
            minted.
          </BodyLg>
        </InfoBox>
        <Box
          mt={"5"}
          p={"12px"}
          border={"1px solid"}
          borderColor={"gray.100"}
          borderRadius={"12px"}
        >
          <Checkbox
            isChecked={isChecked}
            onChange={handleCheckboxChange}
            alignItems="center"
            size="lg"
            spacing="3"
            my={3}
          >
            <BodyMd>
              I understand and agree that my first deposit will be 0.01 BTC.
            </BodyMd>
          </Checkbox>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={3}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} isDisabled={!isChecked}>
          Confirm
        </Button>
      </ModalFooter>
    </>
  )
}

export const FirstDepositWarningModal = withBaseModal(
  FirstDepositWarningModalBase
)
