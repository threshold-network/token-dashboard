import React from "react"
import { Container, Text } from "@chakra-ui/react"
import { Divider as TDivider } from "../src/components/Divider"
import { FaArrowCircleDown } from "react-icons/all"

const Template = ({ icon }: any) => {
  return (
    <Container>
      <Text>Above the divider</Text>
      <TDivider icon={icon ? FaArrowCircleDown : undefined} />
      <Text>Below the divider</Text>
    </Container>
  )
}

export const Divider = Template.bind({})

// @ts-ignore
Divider.args = {
  icon: true,
}

export default {
  title: "Divider",
  component: Divider,
  argTypes: {
    icon: {
      options: [true, false],
      control: { type: "radio" },
    },
  },
}
