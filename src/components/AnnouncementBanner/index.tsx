import { FC, useMemo } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Button,
  CloseButton,
  Stack,
  useDisclosure,
  Image,
  BoxProps,
  useColorMode,
} from "@chakra-ui/react"
import { Card, H4 } from "@threshold-network/components"

interface AnnouncementBannerProps {
  imgSrc: any
  title: string
  buttonText: string
  href: string
  variant?: "primary" | "secondary"
  size?: "sm" | "lg"
  hideCloseBtn?: boolean
}

const AnnouncementBanner: FC<AnnouncementBannerProps & BoxProps> = ({
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

  const { colorMode } = useColorMode()
  const darkMode = colorMode === "dark"

  const bg = useMemo(() => {
    if (variant === "secondary") {
      return darkMode ? "gray.800" : "brand.50"
    }
    return "white"
  }, [colorMode, variant])

  return (
    <Card
      w="100%"
      display={isOpen ? "block" : "none"}
      position="relative"
      px="16"
      mb={4}
      bg={bg}
      {...props}
    >
      {!hideCloseBtn && (
        <CloseButton
          position="absolute"
          right="14px"
          top="12px"
          onClick={onClose}
        />
      )}
      <Stack
        alignItems="center"
        spacing={{ base: "8", xl: "16" }}
        direction={{ base: "column", xl: "row" }}
        bg="inherit"
      >
        <Image maxW={size == "sm" ? "146px" : "280px"} src={imgSrc} />
        <H4
          textAlign={{ base: "center", xl: "unset" }}
          maxW="460px"
          color={darkMode ? "white" : "gray.700"}
        >
          {title}
        </H4>
        <Button
          as={RouterLink}
          to={href}
          w={{ base: "100%", xl: "auto" }}
          mt={{ base: 12, xl: "auto" }}
          marginInlineStart={{ base: "8", xl: "auto !important" }}
          px={{ base: 4, md: 12 }}
        >
          {buttonText}
        </Button>
      </Stack>
    </Card>
  )
}

export default AnnouncementBanner
