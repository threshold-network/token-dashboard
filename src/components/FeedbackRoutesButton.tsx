import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import { IoChatbubbleEllipsesSharp } from "react-icons/all"
import {
  BodyMd,
  Box,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@threshold-network/components"

const feedbackRoutes = [
  { text: "Usability Survey", url: "/feedback/usability-survey" },
  { text: "Suggestions", url: "/feedback/suggestions" },
  { text: "Bug Report", url: "/feedback/bug-report" },
  { text: "Settings", url: "/feedback/settings" },
]

const FeedbackRoutesButton: FC = () => (
  <Menu placement="top" offset={[-85, 15]}>
    <MenuButton
      as={IconButton}
      position="fixed"
      right={8}
      bottom={8}
      borderRadius="full"
      size="lg"
      variant="outline"
      bg={useColorModeValue("white", "gray.800")}
      icon={
        <Icon
          as={IoChatbubbleEllipsesSharp}
          boxSize="24px"
          color={useColorModeValue("gray.500", "gray.50")}
        />
      }
    />
    <MenuList>
      <BodyMd fontWeight="bold" ml={3} mb={3} mt={2}>
        Feedback
      </BodyMd>
      {feedbackRoutes.map(({ text, url }) => (
        <Link key={text} to={url} as={RouterLink}>
          <MenuItem as="span">{text}</MenuItem>
        </Link>
      ))}
    </MenuList>
  </Menu>
)

export default FeedbackRoutesButton
