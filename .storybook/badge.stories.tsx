import React from "react"
import { Badge as ChakraBadge, Container } from "@chakra-ui/react"
import {
  badgeVariants,
  buttonVariants,
  colorSchemes,
  sizes,
} from "./chakraVars"

const Template = ({ icon, ...args }: any) => {
  return (
    <Container>
      <ChakraBadge {...args} fontSize={args.size}>
        Badge
      </ChakraBadge>
    </Container>
  )
}

export const Badge = Template.bind({})

// @ts-ignore
Badge.args = {
  colorScheme: colorSchemes[0],
  variant: badgeVariants[0],
  size: sizes[0],
}

export default {
  title: "Badge",
  component: Badge,
  argTypes: {
    colorScheme: {
      options: colorSchemes,
      control: { type: "radio" },
    },
    variant: {
      options: badgeVariants,
      control: { type: "radio" },
    },
    size: {
      options: sizes,
      control: { type: "radio" },
    },
  },
}
