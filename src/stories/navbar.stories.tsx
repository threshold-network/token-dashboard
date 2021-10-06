import React from "react"
import { Meta, Story } from "@storybook/react"
import NavbarComponent from "../components/Navbar/Component"
import { Provider } from "react-redux"
import store from "../store"

const requiredArgs = {
  openModal: () => {},
  hideAlert: false,
  setHideAlert: () => {},
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
  account: "7788",
  ...requiredArgs,
}

export default {
  title: "Navbar",
  component: NavbarComponent,
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
