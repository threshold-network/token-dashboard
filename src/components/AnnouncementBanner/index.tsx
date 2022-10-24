import { FC } from "react"
import {
  Card,
  H4,
  LabelMd,
  CloseButton,
  Stack,
  useDisclosure,
  Image,
  BoxProps,
  useMultiStyleConfig,
} from "@threshold-network/components"
import ButtonLink from "../ButtonLink"

interface AnnouncementBannerProps {
  imgSrc: any
  preTitle?: string
  title: string
  buttonText: string
  href: string
  variant?: "primary" | "secondary"
  size?: "sm" | "lg"
  hideCloseBtn?: boolean
}

const AnnouncementBanner: FC<AnnouncementBannerProps & BoxProps> = ({
  preTitle,
  title,
  imgSrc,
  buttonText,
  href,
  variant = "primary",
  size = "sm",
  hideCloseBtn = false,
  ...props
}) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  const styles = useMultiStyleConfig("AnnouncementBanner", {
    isOpen,
    size,
    variant,
    ...props,
  })

  return (
    <Card sx={styles.container} {...props}>
      {!hideCloseBtn && (
        <CloseButton sx={styles.closeButton} onClick={onClose} />
      )}
      <Stack
        direction={{ base: "column", xl: "row" }}
        spacing={{ base: "8", xl: "16" }}
        sx={styles.subContainer}
      >
        <Image maxW={size == "sm" ? "146px" : "280px"} src={imgSrc} />
        <Stack>
          {preTitle && <LabelMd sx={styles.preTitle}>{preTitle}</LabelMd>}
          <H4 sx={styles.title}>{title}</H4>
        </Stack>
        <ButtonLink to={href} sx={styles.ctaButton}>
          {buttonText}
        </ButtonLink>
      </Stack>
    </Card>
  )
}

export default AnnouncementBanner
