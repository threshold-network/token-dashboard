import { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import { theme } from "@threshold-network/components"

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[]
  initialIndex?: number
}

/**
 * Custom render function that wraps components with MemoryRouter and basic routing
 * to prevent "No routes matched location" warnings in tests
 * @param {ReactElement} ui - The React element to render
 * @param {CustomRenderOptions} options - Optional configuration for router and render
 * @return {RenderResult} The result of rendering the element
 */
export const renderWithRouter = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const {
    initialEntries = ["/"],
    initialIndex = 0,
    ...renderOptions
  } = options || {}

  const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <ChakraProvider theme={theme}>
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        <Routes>
          <Route path="*" element={<>{children}</>} />
        </Routes>
      </MemoryRouter>
    </ChakraProvider>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from "@testing-library/react"
