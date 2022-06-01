import { FC } from "react"
import { Box, HStack, ListItem, ListItemProps } from "@chakra-ui/react"
import { Body1, Body3 } from "../Typography"
import ExternalLink from "../ExternalLink"
import { ExternalHref } from "../../enums"

interface ProviderItem extends ListItemProps {
  title: string
  subTitle?: string
  href: ExternalHref | string
  cta?: string
}

const LinkDetailsListItem: FC<ProviderItem> = ({
  title,
  subTitle,
  href,
  cta = "Learn more",
  ...props
}) => (
  <ListItem
    as={HStack}
    spacing="4"
    bg="gray.50"
    p="4"
    borderRadius="2"
    {...props}
  >
    <Box bg="brand.500" borderRadius="8px" w="48px" height="48px" />
    <Box>
      <Body1>{title}</Body1>
      <Body3>{subTitle}</Body3>
    </Box>
    <ExternalLink
      fontWeight="600"
      color="gray.700"
      ml="auto !important"
      text={cta}
      href={href}
      withArrow
    />
  </ListItem>
)

export default LinkDetailsListItem
