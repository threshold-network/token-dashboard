import TokenBalanceInputComponent, {
  TokenBalanceInputProps,
} from "../components/TokenBalanceInput"
import { Meta, Story } from "@storybook/react"
import Nu from "../static/icons/NuLight"
import Keep from "../static/icons/KeepLight"
import { useState } from "react"
import { ChakraIconMap } from "../types"

const iconMap: ChakraIconMap = {
  Nu: Nu,
  Keep: Keep,
}

const Template: Story<Omit<TokenBalanceInputProps, "icon"> & { icon: string }> =
  ({ icon, max, label }) => {
    const [amount, setAmount] = useState<string | number>("")

    const Icon = iconMap[icon]

    return (
      <TokenBalanceInputComponent
        {...{ max, amount, setAmount, label }}
        icon={Icon}
      />
    )
  }

export const TokenBalanceInput = Template.bind({})

TokenBalanceInput.args = {
  max: 500123.5678,
  icon: "Keep",
  label: "Keep Amount",
}

export default {
  title: "Token Balance Input",
  component: TokenBalanceInput,
  argTypes: {
    max: {
      description: "The value user clicks the MAX button",
      control: { type: "text" },
    },
    label: {
      description: "The label above the input",
      control: { type: "text" },
    },
    icon: {
      description: "Adjusts token icon",
      options: ["Keep", "Nu"],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: "Keep" },
      },
    },
  },
} as Meta
