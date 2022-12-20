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
  StylesProvider,
  useStyles,
} from "@threshold-network/components"
import ButtonLink from "../ButtonLink"

type AnnouncementBannerContainerProps = {
  variant?: "primary" | "secondary"
  size?: "sm" | "lg"
  hideCloseBtn?: boolean
} & BoxProps

type AnnouncementBannerTitleProps = {
  preTitle?: string
  title: string
}

type AnnouncementBannerBodyProps = {
  imgSrc: any
  buttonText: string
  href: string
} & AnnouncementBannerTitleProps

type AnnouncementBannerProps = AnnouncementBannerContainerProps &
  AnnouncementBannerBodyProps

export const AnnouncementBannerContainer: FC<
  AnnouncementBannerContainerProps
> = ({ size, variant, hideCloseBtn, children, ...props }) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  const styles = useMultiStyleConfig("AnnouncementBanner", {
    size,
    variant,
  })

  return isOpen ? (
    <Card sx={styles.container} {...props}>
      {!hideCloseBtn && (
        <CloseButton sx={styles.closeButton} onClick={onClose} />
      )}
      <StylesProvider value={styles}>{children}</StylesProvider>
    </Card>
  ) : null
}

export const AnnouncementBannerTitle: FC<AnnouncementBannerTitleProps> = ({
  preTitle,
  title,
}) => {
  const styles = useStyles()

  return (
    <>
      {preTitle && <LabelMd sx={styles.preTitle}>{preTitle}</LabelMd>}
      <H4 sx={styles.title}>{title}</H4>
    </>
  )
}

const AnnouncementBannerBody: FC<AnnouncementBannerBodyProps> = ({
  preTitle,
  imgSrc,
  title,
  href,
  buttonText,
}) => {
  const styles = useStyles()

  return (
    <Stack
      direction={{ base: "column", xl: "row" }}
      spacing={{ base: "8", xl: "16" }}
      sx={styles.subContainer}
    >
      <Image src={imgSrc} sx={styles.image} />
      <Stack>
        <AnnouncementBannerTitle title={title} preTitle={preTitle} />
      </Stack>
      <ButtonLink to={href} sx={styles.ctaButton}>
        {buttonText}
      </ButtonLink>
    </Stack>
  )
}

const AnnouncementBanner: FC<AnnouncementBannerProps> = ({
  preTitle,
  title,
  imgSrc,
  buttonText,
  href,
  ...props
}) => {
  return (
    <AnnouncementBannerContainer {...props}>
      <AnnouncementBannerBody
        title={title}
        preTitle={preTitle}
        imgSrc={imgSrc}
        href={href}
        buttonText={buttonText}
      />
    </AnnouncementBannerContainer>
  )
}

export default AnnouncementBanner
