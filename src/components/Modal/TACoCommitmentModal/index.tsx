import { FC } from "react"
import {
  BodyLg,
  Button,
  Card,
  H5,
  ModalBody,
  ModalFooter,
  ModalHeader,
  LabelSm,
  BodyMd,
  List,
  ListItem,
} from "@threshold-network/components"
import TransactionSuccessModal from "../TransactionSuccessModal"
import StakingStats from "../../StakingStats"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import withBaseModal from "../withBaseModal"
import { UnstakeType, ExternalHref } from "../../../enums"
import Link from "../../Link"
import ModalCloseButton from "../ModalCloseButton"

export type TACoCommitProps = BaseModalProps & {
  stakingProvider: string
}

// TACo Commitment Modal
//  has two buttons, one for committing and one for canceling
const TACoCommitmentModal: FC<TACoCommitProps> = ({}) => {
  return <Card>{/* Header */}</Card>
}

export default withBaseModal(TACoCommitmentModal)
