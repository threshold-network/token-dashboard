import {
  Box,
  Icon,
  IconButton,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { BsDiscord, BsGithub } from "react-icons/all"
import { useSidebar } from "../../hooks/useSidebar"
import { Body1, Body3 } from "../Typography"
import { ExternalLink } from "../../enums"
import { FC } from "react"
import DarkModeSwitcher from "../DarkModeSwitcher"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"

const FooterItem: FC<{ href: string; icon: any; text: string }> = ({
  href,
  icon,
  text,
}) => {
  const { isOpen } = useSidebar()
  const breakpoint = useChakraBreakpoint("sm")

  return (
    <Box
      as={Link}
      href={href}
      target="_blank"
      display={isOpen ? "flex" : "grid"}
      _hover={{
        textDecoration: "none",
      }}
    >
      {isOpen && !breakpoint ? (
        <Icon
          h={6}
          w={6}
          as={icon}
          color="gray.300"
          m={isOpen ? undefined : "auto"}
          mr={isOpen ? 2 : undefined}
        />
      ) : (
        <IconButton
          icon={<Icon color="gray.300" as={icon} />}
          variant="ghost"
          aria-label={text}
        />
      )}
      {isOpen && !breakpoint && (
        <Body1 fontWeight="bold" color="gray.300">
          {text}
        </Body1>
      )}
    </Box>
  )
}

const SidebarFooter = () => {
  const { isOpen } = useSidebar()
  const breakpoint = useChakraBreakpoint("sm")
  return (
    <Stack
      alignSelf="flex-end"
      borderTop="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      padding={4}
      width="100%"
      spacing={4}
    >
      <Stack
        direction={breakpoint ? "row" : "column"}
        justifyContent={breakpoint ? "center" : "inherit"}
        spacing={4}
      >
        <DarkModeSwitcher />
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
      </Stack>
      <Stack textAlign={breakpoint ? "center" : "left"}>
        {isOpen && <Body3 color="gray.300">Threshold Network</Body3>}
        <Body3 color="gray.300">&copy; {new Date().getFullYear()}</Body3>
      </Stack>
    </Stack>
  )
}

export default SidebarFooter
