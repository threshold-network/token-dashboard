import { FC } from "react"
import {
  Alert,
  AlertIcon,
  Box,
  HStack,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  Button,
} from "@chakra-ui/react"
import Confetti from "react-confetti"
import Threshold from "../../../static/icons/Ttoken"
import { Body3, H5 } from "../../Typography"
import { Divider } from "../../Divider"
import StakingStats from "./StakingStats"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import { useStakingState } from "../../../hooks/useStakingState"

interface StakingSuccessProps extends BaseModalProps {
  transactionHash: string
}

const StakingSuccessModal: FC<StakingSuccessProps> = ({
  transactionHash,
  closeModal,
}) => {
  const {
    stakingState: { stakeAmount, operator, beneficiary, authorizer },
  } = useStakingState()

  return (
    <>
      <ModalHeader>
        <H5>Success</H5>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Alert status="success" mb={4}>
          <AlertIcon />
          Your stake was successful!
        </Alert>
        <HStack
          borderRadius="md"
          bg="gray.50"
          justify="center"
          py={12}
          position="relative"
          mb={8}
        >
          <Box position="absolute" left="-20px" top="-25px" zindex="-1">
            {/* TODO: create a component wrapper for `Confetti` */}
            <Confetti
              width={440}
              height={250}
              confettiSource={{ x: 200, y: 40, h: 100, w: 100 }}
              numberOfPieces={50}
            />
          </Box>
          <Icon zIndex={999} height="105px" w="105px" as={Threshold} />
        </HStack>

        <StakingStats {...{ stakeAmount, beneficiary, operator, authorizer }} />

        <Body3 mt="4rem" align="center">
          <ViewInBlockExplorer
            text="View"
            id={transactionHash}
            type={ExplorerDataType.TRANSACTION}
          />{" "}
          transaction on Etherscan
        </Body3>
        <Divider />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakingSuccessModal)
