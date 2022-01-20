import { FC } from "react"
import {
  Alert,
  AlertIcon,
  Box,
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
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { useModal } from "../../../hooks/useModal"
import InfoBox from "../../InfoBox"

interface SuccessModalProps {
  title?: string
  subTitle?: string
  body?: JSX.Element
  transactionHash?: string
}

const StakingSuccessModal: FC<SuccessModalProps> = ({
  title = "success",
  subTitle = "Your transaction was successful!",
  body,
  transactionHash,
}) => {
  const { closeModal } = useModal()

  return (
    <>
      <ModalHeader>
        <H5>{title}</H5>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Alert status="success" mb={4}>
          <AlertIcon />
          {subTitle}
        </Alert>
        <InfoBox
          direction="row"
          justify="center"
          py={12}
          position="relative"
          mb={8}
        >
          <Box position="absolute" left="-20px" top="-25px" zindex="-1">
            <Confetti
              width={440}
              height={250}
              confettiSource={{ x: 200, y: 40, h: 100, w: 100 }}
              numberOfPieces={50}
            />
          </Box>
          <Icon zIndex={999} height="105px" w="105px" as={Threshold} m="auto" />
        </InfoBox>
        {body}
        {transactionHash && (
          <Body3 mt="4rem" align="center">
            <ViewInBlockExplorer
              text="View"
              id={transactionHash}
              type={ExplorerDataType.TRANSACTION}
            />{" "}
            transaction on Etherscan
          </Body3>
        )}
        <Divider />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export default StakingSuccessModal
