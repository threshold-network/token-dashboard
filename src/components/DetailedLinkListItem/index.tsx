import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  BodyLg,
  BodySm,
  BoxProps,
  Button,
  Flex,
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
    <Flex sx={styles.container} as="li">
      {imgSrc ? (
        <Image sx={styles.image} src={imgSrc} />
      ) : (
        <Square sx={styles.imageFallback}>
          {imgFallback && imgFallback.slice(0, 3).toUpperCase()}
        </Square>
      )}
      <Stack
        spacing={0}
        my={{ base: "2", sm: undefined }}
        mr={{ sm: "auto !important" }}
        flex={1}
        minWidth="0"
      >
        <BodyLg sx={styles.title}>{title}</BodyLg>
        <BodySm sx={styles.subTitle}>{subtitle}</BodySm>
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
    </Flex>
  )
}

export default DetailedLinkListItem
