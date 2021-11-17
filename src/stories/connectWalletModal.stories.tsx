import { Meta, Story } from "@storybook/react"
import { Provider } from "react-redux"
import store from "../store"
import ConnectWalletModalComponent from "../components/Modal/SelectWalletModal"
import getLibrary from "../web3/library"
import { Web3ReactProvider } from "@web3-react/core"

const Template: Story = (args) => {
  return <ConnectWalletModalComponent {...args} closeModal={() => {}} />
}

export const ConnectWalletModal = Template.bind({})

export default {
  title: "Connect Wallet Modal",
  component: ConnectWalletModal,
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
