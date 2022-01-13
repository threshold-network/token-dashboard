import { FC } from "react"
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Icon,
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
import StakingStats from "../StakingSuccessModal/StakingStats"
import { useStakingState } from "../../../hooks/useStakingState"

const StakingSuccessPreNeededModal: FC<BaseModalProps> = ({ closeModal }) => {
  const {
    stakingState: { stakeAmount, operator, beneficiary, authorizer },
  } = useStakingState()

  return (
    <>
      <ModalHeader>Take note</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Alert status="warning" mb={4}>
          <AlertIcon />
          You haven't added a PRE Worker Adddress
        </Alert>
        <Box borderRadius="md" bg="gray.50" p={6} mb={8}>
          <H5 mb={4} color="gray.800">
            Your Stake was successful.
          </H5>
          <Body1 color="gray.700">
            You'll need to run a PRE node to receive rewards. You can this this
            up{" "}
            <Link
              href="SOME_LINK"
              target="_blank"
              color="brand.500"
              textDecoration="underline"
            >
              here <Icon boxSize="12px" as={FiArrowUpRight} color="brand.500" />
            </Link>
          </Body1>
        </Box>
        <StakingStats {...{ stakeAmount, beneficiary, operator, authorizer }} />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakingSuccessPreNeededModal)
