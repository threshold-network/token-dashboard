import { Meta, Story } from "@storybook/react"
import { Provider } from "react-redux"
import SidebarComponent from "../components/Sidebar"
import store from "../store"

const Template: Story = (args) => <SidebarComponent {...args} />

export const Sidebar = Template.bind({})

export default {
  title: "Sidebar",
  component: SidebarComponent,
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
