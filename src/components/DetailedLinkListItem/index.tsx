import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  BodyLg,
  BodySm,
  BoxProps,
  Button,
  HStack,
  Image,
  Square,
  Stack,
  useMultiStyleConfig,
} from "@threshold-network/components"
import ExternalLink from "../ExternalLink"

export interface DetailedLinkListItemProps extends BoxProps {
  imgSrc?: any
  imgFallback?: string
  title: string
  subtitle?: string
  linkText?: string
  href: string
  isExternal?: boolean
}

const DetailedLinkListItem: FC<DetailedLinkListItemProps> = ({
  imgSrc,
  imgFallback,
  title,
  subtitle,
  linkText,
  href,
  isExternal = true,
  ...restProps
}) => {
  const styles = useMultiStyleConfig("DetailedLinkListItem", restProps)

  const _linkText = linkText || "Read More"

  return (
    <HStack sx={styles.container} as="li">
      {imgSrc ? (
        <Image sx={styles.image} src={imgSrc} />
      ) : (
        <Square sx={styles.imageFallback}>
          {imgFallback && imgFallback.slice(0, 3).toUpperCase()}
        </Square>
      )}
      <Stack spacing={0} mr="auto !important">
        <BodyLg sx={styles.title}>{title}</BodyLg>
        <BodySm sx={styles.subtitle}>{subtitle}</BodySm>
      </Stack>
      {isExternal ? (
        <ExternalLink
          href={href}
          sx={styles.link}
          text={_linkText}
          withArrow
          color={styles.link.color as string}
        />
      ) : (
        <Button sx={styles.link} variant="link" as={RouterLink} to={href}>
          {_linkText}
        </Button>
      )}
    </HStack>
  )
}

export default DetailedLinkListItem
