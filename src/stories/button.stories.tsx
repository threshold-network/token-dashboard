import {
  Button as ChakraButton,
  ButtonProps,
  Container,
} from "@chakra-ui/react"
import { MdBuild } from "react-icons/md"
import { Story, Meta } from "@storybook/react"
import {
  buttonVariants,
  colorSchemes,
  sizes,
} from "../../.storybook/chakraVars"

interface ButtonStoryProps extends ButtonProps {
  icon: string
}

const Template: Story<ButtonStoryProps> = ({
  icon,
  ...args
}: ButtonStoryProps) => {
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

export const Button = Template.bind({
  colorScheme: "brand",
  variant: "solid",
  size: "md",
  icon: "none",
  disabled: false,
})

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
} as Meta
