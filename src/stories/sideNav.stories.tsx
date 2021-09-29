import React from "react"
import { Container } from "@chakra-ui/react"
import SideNavComponent from "../components/SideNav"

const Template = () => {
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
}
