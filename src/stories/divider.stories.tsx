import React from "react"
import { Story, Meta } from "@storybook/react"
import { DividerProps, Container, Text } from "@chakra-ui/react"
import { Divider as TDivider, DividerIcon } from "../components/Divider"
import {
  FaArrowCircleDown,
  FaArrowCircleUp,
  FiAlertCircle,
} from "react-icons/all"
import { IconMap } from "../types"

interface DividerStoryProps extends Omit<DividerProps, "orientation"> {
  children: string | undefined
}

const iconMap: IconMap = {
  ArrowDown: <DividerIcon as={FaArrowCircleDown} />,
  ArrowUp: <DividerIcon as={FaArrowCircleUp} />,
  Alert: <DividerIcon as={FiAlertCircle} />,
}

const Template: Story<DividerStoryProps> = ({ children }) => {
  const icon = children ? iconMap[children] : undefined
  return (
    <Container>
      <Text>Above the divider</Text>
      <TDivider>{icon}</TDivider>
      <Text>Below the divider</Text>
    </Container>
  )
}

export const Divider = Template.bind({})

export default {
  title: "Divider",
  component: Divider,
  argTypes: {
    children: {
      description:
        "You can add an icon to the divider by passing `< DividerIcon as={YOUR_ICON} />`",
      control: {
        type: "select",
        options: {
          Undefined: undefined,
          ArrowDown: "ArrowDown",
          ArrowUp: "ArrowUp",
          Alert: "Alert",
        },
      },
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
  },
} as Meta
