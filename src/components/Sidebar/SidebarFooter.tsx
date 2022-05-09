import { Box, Divider, HStack, Icon, IconButton, Link } from "@chakra-ui/react"
import { BsDiscord, BsGithub } from "react-icons/all"
import { useSidebar } from "../../hooks/useSidebar"
import { BodySm } from "@threshold-network/components"
import { ExternalHref } from "../../enums"
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
              href={ExternalHref.thresholdGithub}
              icon={BsGithub}
            />
            <FooterItem
              text="Discord"
              href={ExternalHref.thresholdDiscord}
              icon={BsDiscord}
            />
          </HStack>
          <BodySm color="gray.300" textAlign="center">
            &copy; {new Date().getFullYear()} Threshold Network
          </BodySm>
        </Box>
      ) : (
        <>
          <NavItem
            isFooter
            text="Github"
            activeIcon={BsGithub}
            passiveIcon={BsGithub}
            href={ExternalHref.thresholdGithub}
          />
          <NavItem
            isFooter
            text="Discord"
            activeIcon={BsDiscord}
            passiveIcon={BsDiscord}
            href={ExternalHref.thresholdDiscord}
          />
        </>
      )}
    </Box>
  )
}

export default SidebarFooter
