import { FC } from "react"
import { Box, HStack, ListItem, ListItemProps } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Body1, Body3 } from "../Typography"
import ExternalLink from "../ExternalLink"
import { ExternalHref } from "../../enums"

interface LinkDetailsListItemProps extends ListItemProps {
  title: string
  subTitle?: string
  href: ExternalHref
  cta?: string
}

const LinkDetailsListItem: FC<LinkDetailsListItemProps> = ({
  title,
  subTitle,
  href,
  cta = "Learn more",
  ...props
}) => (
  <ListItem spacing="4" bg="gray.50" p="4" borderRadius="2" {...props}>
    <HStack>
      <Box bg="brand.500" borderRadius="8px" w="48px" height="48px" />
      <Box>
        <Body1>{title}</Body1>
        <Body3>{subTitle}</Body3>
      </Box>
      <ExternalLink
        fontSize="14px"
        lineHeight="20px"
        fontWeight="600"
        color="gray.700"
        ml="auto !important"
        text={cta}
        href={href}
        icon={<ExternalLinkIcon ml="2" w="14px" h="14px" />}
      />
    </HStack>
  </ListItem>
)

export default LinkDetailsListItem
