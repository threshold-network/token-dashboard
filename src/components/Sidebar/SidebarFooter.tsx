import {
  Box,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Stack,
  StackDivider,
  useColorModeValue,
} from "@chakra-ui/react"
import { BsDiscord, BsGithub, IoHomeSharp } from "react-icons/all"
import { useSidebar } from "../../hooks/useSidebar"
import { Body1, Body3 } from "../Typography"
import { ExternalLink } from "../../enums"
import { FC } from "react"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import DarkModeSwitcher from "../Navbar/DarkModeSwitcher"
import { IoHomeOutlineSharp } from "../../static/icons/IoHomeOutlineSharp"
import NavItem from "./NavItem"

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
      // display={isOpen ? "flex" : "grid"}
      _hover={{
        textDecoration: "none",
        color: "gray.700",
        cursor: "pointer",
      }}
    >
      <IconButton
        variant="side-bar"
        aria-label={text}
        icon={<Icon as={icon} />}
      />
    </Box>
  )
}

const SidebarFooter = () => {
  const { isOpen } = useSidebar()
  const isMobile = useChakraBreakpoint("sm")
  return (
    <Box>
      <Divider w="auto" marginX={isOpen ? "18px !important" : "8px"} />
      {isMobile ? (
        <Box p={8}>
          <HStack justify="center">
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
          </HStack>
          <Body3 color="gray.300" textAlign="center">
            &copy; {new Date().getFullYear()} Threshold Network
          </Body3>
        </Box>
      ) : (
        <>
          <NavItem
            isFooter
            text="Github"
            icon={BsGithub}
            href={ExternalLink.THRESHOLD_GITHUB}
          />
          <NavItem
            isFooter
            text="Discord"
            icon={BsDiscord}
            href={ExternalLink.THRESHOLD_DISCORD}
          />
        </>
      )}
    </Box>
  )
}

export default SidebarFooter
