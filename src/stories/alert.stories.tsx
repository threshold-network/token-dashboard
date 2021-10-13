import {
  Alert as ChakraAlert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
  Stack,
} from "@chakra-ui/react"
import { Meta, Story } from "@storybook/react"

const Template: Story<AlertProps & { title: string; description: string }> = ({
  ...args
}) => {
  return (
    <Stack spacing={8}>
      <ChakraAlert {...args}>
        <AlertIcon />
        {args.description}
      </ChakraAlert>
      <ChakraAlert {...args}>
        <AlertIcon />
        <Stack>
          <AlertTitle>{args.title}</AlertTitle>
          <AlertDescription>{args.description}</AlertDescription>
        </Stack>
      </ChakraAlert>
    </Stack>
  )
}

export const Alert = Template.bind({})
Alert.args = {
  status: "info",
  variant: "subtle",
  description:
    "Here's a description about something the user should be aware of",
  title: "Alert Title",
}

export default {
  title: "Alert",
  component: Alert,
  argTypes: {
    status: {
      description: "Adjusts the status of the alert",
      options: ["info", "error", "success", "warning"],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: "info" },
      },
    },
    variant: {
      description: "Adjusts the variant of the alert",
      options: ["subtle", "solid"],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: "subtle" },
      },
    },
  },
} as Meta
