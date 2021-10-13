import { Meta, Story } from "@storybook/react"
import { Box } from "@chakra-ui/react"
import {
  Body1,
  Body2,
  Body3,
  H1,
  H2,
  H3,
  H4,
  H5,
  Headline,
} from "../components/Typography"

const Template: Story = () => {
  return (
    <Box>
      <Headline>Here is a Headline</Headline>
      <H1>Here is H1</H1>
      <H2>Here is H2</H2>
      <H3>Here is H3</H3>
      <H4>Here is H4</H4>
      <H5>Here is H5</H5>
      <Body1>Body1</Body1>
      <Body2>Body2</Body2>
      <Body3>Body3</Body3>
    </Box>
  )
}

export const Typography = Template.bind({})

export default {
  title: "Typography",
  component: Typography,
} as Meta
