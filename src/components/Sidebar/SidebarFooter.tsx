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
import { BsDiscord, BsGithub } from "react-icons/all"
import { useSidebar } from "../../hooks/useSidebar"
import { Body1, Body3 } from "../Typography"
import { ExternalLink } from "../../enums"
import { FC } from "react"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import DarkModeSwitcher from "../Navbar/DarkModeSwitcher"

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
    >
      {isOpen && !isMobile ? (
        <Flex>
          <Icon
            h="18px"
            w="18px"
            as={icon}
            color="gray.300"
            mt="4px"
            mx={isOpen ? 2 : "auto"}
          />
          <Body1 fontWeight="bold" color="gray.300" ml={0}>
            {text}
          </Body1>
        </Flex>
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
      borderColor={useColorModeValue("gray.100", "gray.700")}
      padding={4}
      width="100%"
    >
      <Divider mb={4} />
      <Stack
        direction={isMobile ? "row" : "column"}
        justifyContent={isMobile ? "center" : "inherit"}
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
      </Stack>
      <Stack textAlign={isMobile ? "center" : "left"} pt={4} ml="10px">
        {isOpen && <Body3 color="gray.300">Threshold Network</Body3>}
        <Body3 color="gray.300">&copy; {new Date().getFullYear()}</Body3>
      </Stack>
    </Stack>
  )
}

export default SidebarFooter
