import { FC } from "react"
import {
  BodyMd,
  Box,
  Button,
  Card,
  CloseButton,
  Heading,
  Image,
  Stack,
  TextProps,
  BoxProps,
  useMultiStyleConfig,
  useColorModeValue,
  useDisclosure,
} from "@threshold-network/components"

// TODO pull this from components repo when it's merged
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

interface Props {
  imgSrc: any
  title: string
  subTitle?: string
  buttonText: string
  onClick: VoidFunction
}

const SecondaryAnnouncementBanner: FC<Props & BoxProps> = ({
  title,
  subTitle,
  imgSrc,
  buttonText,
  onClick,
  ...props
}) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  const styles = useMultiStyleConfig("SecondaryAnnouncementBanner", {
    isOpen,
    ...props,
  })

  return (
    <Card sx={styles.container}>
      <Stack
        spacing={{ base: "8", xl: "16" }}
        direction={{ base: "column", xl: "row" }}
        justifyContent="space-between"
      >
        <Box sx={styles.subContainer}>
          <Image sx={styles.image} src={imgSrc} />
          <Stack spacing={0} ml={4}>
            <H6 sx={styles.title}>{title}</H6>
            <BodyMd sx={styles.subTitle}>{subTitle}</BodyMd>
          </Stack>
        </Box>
        <Box display="flex" alignItems="center">
          <Button sx={styles.ctaButton} variant="outline" onClick={onClick}>
            {buttonText}
          </Button>
          <CloseButton sx={styles.closeButton} onClick={onClose} />
        </Box>
      </Stack>
    </Card>
  )
}

export default SecondaryAnnouncementBanner
