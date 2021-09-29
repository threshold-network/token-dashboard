import React from "react"
import { Container } from "@chakra-ui/react"
import { Story, Meta } from "@storybook/react"
import SideNavComponent from "../components/SideNav"

const Template: Story = () => {
  return (
    <Container>
      <SideNavComponent />
    </Container>
  )
}

export const Sidenav = Template.bind({})

export default {
  title: "Sidenav",
  component: Sidenav,
} as Meta
