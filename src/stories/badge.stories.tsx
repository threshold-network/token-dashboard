import { Badge as ChakraBadge, BadgeProps, Container } from "@chakra-ui/react"
import { Meta, Story } from "@storybook/react"
import { badgeVariants, colorSchemes, sizes } from "../../.storybook/chakraVars"

const Template: Story<BadgeProps> = ({ ...args }) => {
  return (
    <Container>
      <ChakraBadge {...args} fontSize={args.fontSize}>
        Badge
      </ChakraBadge>
    </Container>
  )
}

export const Badge = Template.bind({
  colorScheme: "brand",
  variant: "solid",
  size: "sm",
})

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
    fontSize: {
      options: sizes,
      control: { type: "radio" },
    },
  },
} as Meta
