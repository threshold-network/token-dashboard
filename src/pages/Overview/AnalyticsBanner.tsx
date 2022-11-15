import { FC } from "react"
import {
  Box,
  BodyMd,
  Button,
  Card,
  CloseButton,
  Heading,
  Image,
  Stack,
  TextProps,
  useColorModeValue,
  useDisclosure,
} from "@threshold-network/components"
import analyticsImageLight from "../../static/images/AnalyticsIllustration.png"
import analyticsImageDark from "../../static/images/AnalyticsIllustrationDark.png"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"
import SecondaryAnnouncementBanner from "../../components/AnnouncementBanner/SecondaryAnnouncementBanner"

// TODO pull this from components repo
export const H6: FC<TextProps> = (props) => {
  return (
    <Heading
      as="h6"
      fontWeight="500"
      fontSize="18px"
      lineHeight="28px"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

const AnalyticsBanner: FC = () => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { openModal } = useModal()

  const imgSrc = useColorModeValue(analyticsImageLight, analyticsImageDark)

  return (
    <SecondaryAnnouncementBanner
      title="Want to help improve the Threshold product experience?"
      subTitle="Opt in now to Threshold’s anonymous analytics."
      imgSrc={imgSrc}
      buttonText="View Details"
      onClick={() => openModal(ModalType.Analytics)}
    />
  )
}

export default AnalyticsBanner
