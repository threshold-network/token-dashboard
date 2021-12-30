import { Box, Divider, HStack, Icon, IconButton, Link } from "@chakra-ui/react"
import { BsDiscord, BsGithub } from "react-icons/all"
import { useSidebar } from "../../hooks/useSidebar"
import { Body3 } from "../Typography"
import { ExternalLink } from "../../enums"
import { FC } from "react"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import NavItem from "./NavItem"

const FooterItem: FC<{ href: string; icon: any; text: string }> = ({
  href,
  icon,
  text,
}) => {
  return (
    <Box
      as={Link}
      href={href}
      target="_blank"
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
  const isMobile = useChakraBreakpoint("md")
  return (
    <Box as="footer">
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
            activeIcon={BsGithub}
            passiveIcon={BsGithub}
            href={ExternalLink.THRESHOLD_GITHUB}
          />
          <NavItem
            isFooter
            text="Discord"
            activeIcon={BsDiscord}
            passiveIcon={BsDiscord}
            href={ExternalLink.THRESHOLD_DISCORD}
          />
        </>
      )}
    </Box>
  )
}

export default SidebarFooter
