import { FC, ReactElement } from "react"
import { Provider } from "react-redux"
import { MemoryRouter, MemoryRouterProps } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"
import { render, RenderOptions } from "@testing-library/react"
import { rootReducer } from "../store"

const store = configureStore({
  reducer: rootReducer,
})

const AllTheProviders: FC<MemoryRouterProps> = ({ children, ...rest }) => {
  return (
    <Provider store={store}>
      <MemoryRouter {...rest}>{children}</MemoryRouter>
    </Provider>
  )
}

const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    routerProps?: MemoryRouterProps
  }
) =>
  render(ui, {
    wrapper: (props) => (
      <AllTheProviders {...props} {...options?.routerProps} />
    ),
    ...options,
  })

export * from "@testing-library/react"
export { renderWithProviders }
