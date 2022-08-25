import React, { FC } from "react"
import { FiArrowUpRight } from "react-icons/all"
import { Link as RouterLink } from "react-router-dom"
import {
  BodyLg,
  BodySm,
  BoxProps,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Square,
  Stack,
  useMultiStyleConfig,
} from "@threshold-network/components"

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

  return (
    <HStack sx={styles.container}>
      <Flex>
        {imgSrc ? (
          <Image sx={styles.image} src={imgSrc} />
        ) : imgFallback ? (
          // @ts-ignore
          <Square sx={styles.imageFallback} size={styles.imageFallback.size}>
            {imgFallback.slice(0, 3).toUpperCase()}
          </Square>
        ) : (
          <Square
            sx={styles.imageFallback}
            // @ts-ignore
            size={styles.imageFallback.size}
            background="brand.500"
          />
        )}
        <Stack spacing={0}>
          <BodyLg>{title}</BodyLg>
          <BodySm>{subtitle}</BodySm>
        </Stack>
      </Flex>
      <Button
        sx={styles.link}
        variant="link"
        as={isExternal ? "a" : RouterLink}
        target={isExternal ? "_blank" : undefined}
        // @ts-ignore
        href={isExternal ? href : undefined}
        to={href}
        rightIcon={isExternal ? <Icon as={FiArrowUpRight} /> : undefined}
      >
        {linkText || "Read More"}
      </Button>
    </HStack>
  )
}

export default DetailedLinkListItem
