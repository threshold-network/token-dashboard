import { FC } from "react"
import {
  BodyLg,
  BodySm,
  BoxProps,
  Flex,
  Image,
  Square,
  Stack,
  useMultiStyleConfig,
  Icon,
} from "@threshold-network/components"
import Link from "../Link"
import ButtonLink from "../ButtonLink"

export interface DetailedLinkListItemProps extends BoxProps {
  imgSrc?: any
  imgFallback?: string
  title: string
  subtitle?: string
  linkText?: string
  href: string
  isExternal?: boolean
  icon?: any
}

const DetailedLinkListItem: FC<DetailedLinkListItemProps> = ({
  icon,
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
      {imgSrc || icon ? (
        imgSrc ? (
          <Image sx={styles.image} src={imgSrc} />
        ) : (
          <Square sx={styles.imageFallback}>
            <Icon sx={styles.icon} as={icon} />
          </Square>
        )
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
        <Link
          isExternal
          href={href}
          sx={styles.link}
          color={styles.link.color as string}
        >
          {_linkText}
        </Link>
      ) : (
        <ButtonLink sx={styles.link} variant="link" to={href}>
          {_linkText}
        </ButtonLink>
      )}
    </Flex>
  )
}

export default DetailedLinkListItem
