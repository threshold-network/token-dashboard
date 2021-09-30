import { Badge as ChakraBadge, BadgeProps } from "@chakra-ui/react"
import { Meta, Story } from "@storybook/react"

const Template: Story<BadgeProps> = ({ ...args }) => {
  return (
    <ChakraBadge {...args} fontSize={args.fontSize}>
      Badge
    </ChakraBadge>
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
      description: "Adjusts the color scheme of the badge",
      options: ["brand", "green", "yellow", "red"],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: "brand" },
      },
    },
    variant: {
      description: "Adjusts the variant of the badge",
      options: ["subtle", "solid", "outline"],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: "solid" },
      },
    },
    fontSize: {
      description: "Adjusts the size of the badge",
      options: ["sm", "lg"],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: "sm" },
      },
    },
  },
} as Meta
