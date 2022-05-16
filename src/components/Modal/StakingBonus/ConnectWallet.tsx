import { FC } from "react"
import {
  Alert,
  AlertIcon,
  Button,
  List,
  ListIcon,
  ListItem,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react"
import { BsQuestionCircleFill } from "react-icons/all"
import { BaseModalProps } from "../../../types"
import InfoBox from "../../InfoBox"
import { BonusTitle } from "../../StakingBonus"
import SubmitTxButton from "../../SubmitTxButton"

export const ConnectWallet: FC<BaseModalProps> = ({ closeModal }) => {
  return (
    <>
      <ModalHeader>Staking Bonus</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Alert status="warning">
          <AlertIcon alignSelf="center" />
          You have to connect your wallet in order to check your eligibility for
          the Staking Bonus.
        </Alert>
        <InfoBox
          variant="modal"
          display="flex"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <BonusTitle />
          <List spacing="4" marginLeft="9">
            {requirementSkeletons.map(renderRequirementSkeleton)}
          </List>
        </InfoBox>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <SubmitTxButton isFullWidth={false} mt={0} />
      </ModalFooter>
    </>
  )
}

const requirementSkeletons = [{ width: "120px" }, { width: "140px" }]

const renderRequirementSkeleton = (item: { width: string }, index: number) => (
  <RequirementSkeleton key={index} width={item.width} />
)

const RequirementSkeleton: FC<{ width: string }> = ({ width }) => {
  const iconColor = useColorModeValue("gray.100", "gray.700")
  const skeletonColor = useColorModeValue(
    "linear-gradient(180deg, rgba(177, 188, 204, 0.3) 0%, rgba(216, 222, 232, 0.3) 100%)",
    "linear-gradient(180deg, rgba(113, 128, 150, 0.3) 31.25%, rgba(113, 128, 150, 0) 100%)"
  )
  return (
    <ListItem display="flex" alignItems="center">
      <ListIcon
        as={BsQuestionCircleFill}
        color={iconColor}
        width="24px"
        height="24px"
      />
      <Skeleton
        animation="unset"
        height="20px"
        width={width}
        bg={skeletonColor}
      />
    </ListItem>
  )
}
