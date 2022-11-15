import { FC } from "react"
import { useColorModeValue } from "@threshold-network/components"
import analyticsImageLight from "../../static/images/AnalyticsIllustration.png"
import analyticsImageDark from "../../static/images/AnalyticsIllustrationDark.png"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"
import SecondaryAnnouncementBanner from "../../components/AnnouncementBanner/SecondaryAnnouncementBanner"

const AnalyticsBanner: FC = () => {
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
