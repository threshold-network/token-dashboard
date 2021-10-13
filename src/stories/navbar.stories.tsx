import { Meta, Story } from "@storybook/react"
import NavbarComponent from "../components/Navbar/NavbarComponent"
import { Provider } from "react-redux"
import store from "../store"

const requiredArgs = {
  openModal: () => {},
  deactivate: () => {},
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
  account: "",
  ...requiredArgs,
}

export const WalletConnected = Template.bind({})
WalletConnected.args = {
  account: "0xdad30fd9D55Fe12E3435Fb32705242bc1b42a520",
  chainId: 1,
  ...requiredArgs,
}

export default {
  title: "Navbar",
  component: NavbarComponent,
  argTypes: {
    deactivate: {
      description: "A method that disconnects the user's wallet",
    },
    openModal: {
      description: "A method that opens the modal",
    },
    account: {
      description: "The connected ethereum account address",
    },
    chainId: {
      description: "The connected ethereum network",
      options: [1, 3, 42],
      control: { type: "radio" },
      table: {
        defaultValue: { summary: 1 },
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
