import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Button,
  CloseButton,
  Stack,
  useDisclosure,
  Image,
  BoxProps,
} from "@chakra-ui/react"
import { Card, H4 } from "@threshold-network/components"

interface AnnouncementBannerProps {
  imgSrc: any
  title: string
  buttonText: string
  href: string
  variant?: "primary" | "secondary"
  size?: "sm" | "lg"
}

const AnnouncementBanner: FC<AnnouncementBannerProps & BoxProps> = ({
  title,
  imgSrc,
  buttonText,
  href,
  variant = "primary",
  size = "sm",
  ...props
}) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  return (
    <Card
      w="100%"
      display={isOpen ? "block" : "none"}
      position="relative"
      px="16"
      mb={4}
      bg={variant === "secondary" ? "brand.50" : "white"}
      {...props}
    >
      <CloseButton
        position="absolute"
        right="14px"
        top="12px"
        onClick={onClose}
      />
      <Stack
        alignItems="center"
        spacing={{ base: "8", xl: "16" }}
        direction={{ base: "column", xl: "row" }}
        bg="inherit"
      >
        <Image maxW={size == "sm" ? "146px" : "280px"} src={imgSrc} />
        <H4 textAlign={{ base: "center", xl: "unset" }} maxW="460px">
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
