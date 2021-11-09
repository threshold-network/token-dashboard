import { HStack, Icon, Link, Stack, useColorModeValue } from "@chakra-ui/react"
import { BsDiscord, BsGithub } from "react-icons/all"
import { useSidebar } from "../../hooks/useSidebar"
import { Body1, Body3 } from "../Typography"
import { ExternalLink } from "../../enums"
import { FC } from "react"

const FooterItem: FC<{ href: string; icon: any; text: string }> = ({
  href,
  icon,
  text,
}) => {
  const { isOpen } = useSidebar()
  return (
    <HStack as={Link} href={href} target="_blank">
      <Icon
        h={6}
        w={6}
        as={icon}
        color="gray.300"
        m={isOpen ? undefined : "auto"}
        mr={isOpen ? 2 : undefined}
      />
      {isOpen && (
        <Body1 fontWeight="bold" color="gray.300">
          {text}
        </Body1>
      )}
    </HStack>
  )
}

const SidebarFooter = () => {
  const { isOpen } = useSidebar()
  return (
    <Stack
      alignSelf="flex-end"
      borderTop="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      padding={4}
      width="100%"
      spacing={4}
    >
      <FooterItem
        text="Github"
        href={ExternalLink.THRESHOLD_GITHUB}
        icon={BsGithub}
      />
      <FooterItem
        text="Discord"
        href={ExternalLink.THRESHOLD_DISCORD}
        icon={BsDiscord}
      />
      <Stack>
        {isOpen && <Body3 color="gray.300">Threshold Network</Body3>}
        <Body3 color="gray.300" mt="0 !important">
          &copy; {new Date().getFullYear()}
        </Body3>
      </Stack>
    </Stack>
  )
}

export default SidebarFooter
