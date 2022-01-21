import { FC, useState } from "react"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { Body1, H5 } from "../../Typography"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import { FiArrowUpRight } from "react-icons/all"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import InfoBox from "../../InfoBox"

const SubmitPreAddressModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { openModal } = useModal()
  const [preAddress, setPreAddress] = useState("")

  const onSubmit = () => {
    console.log("submitting PRE: ", preAddress)
  }

  const onCancel = () => {
    openModal(ModalType.StakeSuccessPreNeeded)
  }

  return (
    <>
      <ModalHeader>Stake Tokens (2 of 2)</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5 mb={4} color="gray.800">
            PRE Worker Address
          </H5>
          <Body1 color="gray.700">
            You'll need to run a PRE node to receive rewards. You can this up
            <Link
              href="SOME_LINK"
              target="_blank"
              color="brand.500"
              textDecoration="underline"
            >
              here <Icon boxSize="12px" as={FiArrowUpRight} color="brand.500" />
            </Link>
          </Body1>
        </InfoBox>

        <FormControl>
          <FormLabel>PRE Worker Address</FormLabel>
          <Input
            placeholder="Enter PRE Worker Address"
            value={preAddress}
            onChange={(e) => setPreAddress(e.target.value)}
          />
          <FormHelperText>
            You may enter this later, but you must run a node to revive rewards
          </FormHelperText>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onCancel} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Submit</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(SubmitPreAddressModal)
