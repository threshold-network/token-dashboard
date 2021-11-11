import UpgradeCardComponent, {
  UpgradeCardProps,
} from "../components/UpgradeCard"
import { Meta, Story } from "@storybook/react"
import { Web3ReactProvider } from "@web3-react/core"
import getLibrary from "../web3/library"
import { Provider } from "react-redux"
import store from "../store"
import { Token } from "../enums"

const Template: Story<UpgradeCardProps> = ({ token }) => {
  return <UpgradeCardComponent token={token} />
}

export const UpgradeCard = Template.bind({})

UpgradeCard.args = {
  token: Token.Keep,
}

export default {
  title: "Upgrade Card",
  component: UpgradeCard,
  argTypes: {
    token: {
      description: "The token to upgrade",
      options: [Token.Keep, Token.Nu],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: Token.Keep },
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Web3ReactProvider getLibrary={getLibrary}>
          <Provider store={store}>
            <Story />
          </Provider>
        </Web3ReactProvider>
      )
    },
  ],
} as Meta
