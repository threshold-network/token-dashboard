import TokenBalanceInputComponent, {
  TokenBalanceInputProps,
} from "../components/TokenBalanceInput"
import { Meta, Story } from "@storybook/react"
import Nu from "../static/icons/NuLight"
import Keep from "../static/icons/KeepLight"
import { useState } from "react"

const iconMap = {
  Nu: Nu,
  Keep: Keep,
}

const Template: Story<TokenBalanceInputProps> = ({ icon, max }) => {
  const [amount, setAmount] = useState<string | number>("")
  // @ts-ignore
  const Icon = iconMap[icon]
  return (
    <TokenBalanceInputComponent {...{ max, amount, setAmount }} icon={Icon} />
  )
}

export const TokenBalanceInput = Template.bind({})

TokenBalanceInput.args = {
  max: 500123.5678,
  icon: "Keep",
}

export default {
  title: "Token Balance Input",
  component: TokenBalanceInput,
  argTypes: {
    max: {
      description: "The value user clicks the MAX button",
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
