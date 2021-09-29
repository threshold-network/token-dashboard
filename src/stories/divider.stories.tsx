import React from "react"
import { Story, Meta } from "@storybook/react"
import { DividerProps, Container, Text } from "@chakra-ui/react"
import { Divider as TDivider } from "../components/Divider"
import { FaArrowCircleDown } from "react-icons/all"

interface DividerStoryProps extends Omit<DividerProps, "orientation"> {
  icon: string
}

const Template: Story<DividerStoryProps> = ({ icon }) => {
  return (
    <Container>
      <Text>Above the divider</Text>
      <TDivider icon={icon ? FaArrowCircleDown : undefined} />
      <Text>Below the divider</Text>
    </Container>
  )
}

export const Divider = Template.bind({
  icon: true,
})

export default {
  title: "Divider",
  component: Divider,
  argTypes: {
    icon: {
      options: [true, false],
      control: { type: "radio" },
    },
  },
} as Meta
