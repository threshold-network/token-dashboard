import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Card,
  H4,
  LabelMd,
  Button,
  CloseButton,
  Stack,
  useDisclosure,
  Image,
  BoxProps,
} from "@threshold-network/components"
import { useMultiStyleConfig } from "@chakra-ui/react"

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
          <LabelMd sx={styles.preTitle}>{preTitle}</LabelMd>
          <H4 sx={styles.title}>{title}</H4>
        </Stack>
        <Button as={RouterLink} to={href} sx={styles.ctaButton}>
          {buttonText}
        </Button>
      </Stack>
    </Card>
  )
}

export default AnnouncementBanner
