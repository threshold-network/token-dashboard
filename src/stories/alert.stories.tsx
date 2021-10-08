import {
  Alert as ChakraAlert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
  Stack,
} from "@chakra-ui/react"
import { Meta, Story } from "@storybook/react"

const Template: Story<AlertProps> = ({ ...args }) => {
  return (
    <Stack spacing={8}>
      <ChakraAlert {...args}>
        <AlertIcon />
        This is an alert
      </ChakraAlert>
      <ChakraAlert {...args}>
        <AlertIcon />
        <Stack>
          <AlertTitle>Alert Title Goes Here</AlertTitle>
          <AlertDescription>
            Here's a description about something the user should be aware of
          </AlertDescription>
        </Stack>
      </ChakraAlert>
    </Stack>
  )
}

export const Alert = Template.bind({
  status: "info",
})

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
  },
} as Meta
