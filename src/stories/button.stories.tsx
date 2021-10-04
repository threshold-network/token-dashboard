import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react"
import { MdBuild, MdAccessAlarm, MdAttachFile } from "react-icons/md"
import { Story, Meta } from "@storybook/react"

const iconMap = {
  Wrench: <MdBuild />,
  Alarm: <MdAccessAlarm />,
  File: <MdAttachFile />,
}

const Template: Story<ButtonProps> = ({
  leftIcon,
  rightIcon,
  ...args
}: ButtonProps) => {
  // @ts-ignore
  const LeftIcon = leftIcon ? iconMap[leftIcon] : undefined
  // @ts-ignore
  const RightIcon = rightIcon ? iconMap[rightIcon] : undefined

  return (
    <ChakraButton {...args} leftIcon={LeftIcon} rightIcon={RightIcon}>
      Button
    </ChakraButton>
  )
}

export const Button = Template.bind({
  colorScheme: "brand",
  variant: "solid",
  size: "md",
  leftIcon: undefined,
  rightIcon: undefined,
  disabled: false,
})

export default {
  title: "Button",
  component: Button,
  argTypes: {
    colorScheme: {
      description: "Adjusts the color scheme of the button",
      options: ["brand", "red"],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: "brand" },
      },
    },
    variant: {
      description: "Adjusts the variant of the button",
      options: ["solid", "outline", "ghost"],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: "solid" },
      },
    },
    size: {
      description: "Adjusts the size of the button",
      options: ["xs", "sm", "md", "lg"],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: "md" },
      },
    },
    leftIcon: {
      description: "Adds and icon on the left of the button",
      control: {
        type: "select",
        options: {
          Undefined: "undefined",
          Wrench: "Wrench",
          Alarm: "Alarm",
          File: "File",
        },
      },
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    rightIcon: {
      description: "Adds and icon on the right of the button",
      control: {
        type: "select",
        options: {
          Undefined: "undefined",
          Wrench: "Wrench",
          Alarm: "Alarm",
          File: "File",
        },
      },
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
  },
} as Meta
