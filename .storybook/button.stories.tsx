import React from "react"
import { Button as ChakraButton, Container } from "@chakra-ui/react"
import { MdBuild } from "react-icons/md"
import { buttonVariants, colorSchemes, sizes } from "./chakraVars"

const Template = ({ icon, ...args }: any) => {
  return (
    <Container>
      <ChakraButton
        {...args}
        leftIcon={icon === "left" ? <MdBuild /> : undefined}
        rightIcon={icon === "right" ? <MdBuild /> : undefined}
      >
        Button
      </ChakraButton>
    </Container>
  )
}

export const Button = Template.bind({})

// @ts-ignore
Button.args = {
  colorScheme: colorSchemes[0],
  variant: buttonVariants[0],
  size: sizes[1],
  icon: "none",
  disabled: false,
}

export default {
  title: "Button",
  component: Button,
  argTypes: {
    colorScheme: {
      options: colorSchemes,
      control: { type: "radio" },
    },
    variant: {
      options: buttonVariants,
      control: { type: "radio" },
    },
    size: {
      options: sizes,
      control: { type: "radio" },
    },
    icon: {
      options: ["left", "right", "none"],
      control: { type: "radio" },
    },
  },
}
