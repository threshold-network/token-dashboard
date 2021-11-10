import {
  Button,
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
import DarkModeSwitcher from "./DarkModeSwitcher"

const FooterItem: FC<{ href: string; icon: any; text: string }> = ({
  href,
  icon,
  text,
}) => {
  const { isOpen } = useSidebar()
  return (
    <HStack
      as={Link}
      href={href}
      target="_blank"
      tabIndex={-1}
      _hover={{ textDecoration: "none" }}
    >
      {isOpen ? (
        <Button
          variant="side-bar"
          leftIcon={<Icon as={icon} />}
          w="100%"
          justifyContent="flex-start"
        >
          {text}
        </Button>
      ) : (
        <IconButton
          variant="side-bar"
          aria-label={text}
          icon={<Icon boxSize="24px" as={icon} />}
        />
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
      // spacing={4}
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
      <Stack>
        {isOpen && <Body3 color="gray.300">Threshold Network</Body3>}
        <Body3 color="gray.300">&copy; {new Date().getFullYear()}</Body3>
      </Stack>
    </Stack>
  )
}

export default SidebarFooter
