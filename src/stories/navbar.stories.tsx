import { Meta, Story } from "@storybook/react"
import NavbarComponent from "../components/Navbar/Component"
import { Provider } from "react-redux"
import store from "../store"

const requiredArgs = {
  openModal: () => {},
}

const Template: Story = (args) => {
  const props = {
    ...requiredArgs,
    ...args,
  }
  return <NavbarComponent {...props} />
}

export const NoWalletConnected = Template.bind({})
NoWalletConnected.args = {
  ...requiredArgs,
}

export const WalletConnected = Template.bind({})
WalletConnected.args = {
  active: true,
  account: "0xdad30fd9D55Fe12E3435Fb32705242bc1b42a520",
  chainId: 1,
  ...requiredArgs,
}

export default {
  title: "Navbar",
  component: NavbarComponent,
  argTypes: {
    chainId: {
      description: "The connected ethereum network",
      options: [1, 3, 42],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: 3 },
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      )
    },
  ],
} as Meta
