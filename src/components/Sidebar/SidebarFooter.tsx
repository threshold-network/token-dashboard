import {
  Box,
  HStack,
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
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import DarkModeSwitcher from "./DarkModeSwitcher"

const FooterItem: FC<{ href: string; icon: any; text: string }> = ({
  href,
  icon,
  text,
}) => {
  const { isOpen } = useSidebar()
  const isMobile = useChakraBreakpoint("sm")

  return (
    <Box
      as={Link}
      href={href}
      target="_blank"
      display={isOpen ? "flex" : "grid"}
      _hover={{
        textDecoration: "none",
      }}
      w={isMobile ? "100%" : undefined}
    >
      {isOpen && !isMobile ? (
        <HStack>
          <Icon
            h={6}
            w={6}
            as={icon}
            color="gray.300"
            m={isOpen ? undefined : "auto"}
            mr={isOpen ? 2 : undefined}
          />
          <Body1 fontWeight="bold" color="gray.300">
            {text}
          </Body1>
        </HStack>
      ) : (
        <IconButton
          variant="side-bar"
          aria-label={text}
          icon={<Icon boxSize="24px" as={icon} />}
        />
      )}
    </Box>
  )
}

const SidebarFooter = () => {
  const { isOpen } = useSidebar()
  const isMobile = useChakraBreakpoint("sm")
  return (
    <Stack
      alignSelf="flex-end"
      borderTop="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      padding={4}
      width="100%"
    >
      <Stack
        direction={isMobile ? "row" : "column"}
        justifyContent={isMobile ? "center" : "inherit"}
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
      <Stack textAlign={isMobile ? "center" : "left"}>
        {isOpen && <Body3 color="gray.300">Threshold Network</Body3>}
        <Body3 color="gray.300">&copy; {new Date().getFullYear()}</Body3>
      </Stack>
    </Stack>
  )
}

export default SidebarFooter
