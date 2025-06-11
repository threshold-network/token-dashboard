import { render } from "@testing-library/react"
import { ChakraProvider } from "@chakra-ui/react"
import { StarknetIcon } from "../Starknet"
import { ArgentIcon } from "../Argent"

describe("Starknet Icons", () => {
  describe("StarknetIcon", () => {
    it.skip("should render with default size", () => {
      const { container } = render(
        <ChakraProvider>
          <StarknetIcon />
        </ChakraProvider>
      )
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute("width", "24")
      expect(svg).toHaveAttribute("height", "24")
    })

    it.skip("should render with custom size", () => {
      const { container } = render(
        <ChakraProvider>
          <StarknetIcon width="32" height="32" />
        </ChakraProvider>
      )
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("width", "32")
      expect(svg).toHaveAttribute("height", "32")
    })

    it.skip("should render with correct viewBox", () => {
      const { container } = render(
        <ChakraProvider>
          <StarknetIcon />
        </ChakraProvider>
      )
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24")
    })

    it("should have path element", () => {
      const { container } = render(
        <ChakraProvider>
          <StarknetIcon />
        </ChakraProvider>
      )
      const path = container.querySelector("path")
      expect(path).toBeInTheDocument()
    })
  })

  describe("ArgentIcon", () => {
    it("should render with default size", () => {
      const { container } = render(
        <ChakraProvider>
          <ArgentIcon />
        </ChakraProvider>
      )
      const svg = container.querySelector("svg")
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute("width", "24")
      expect(svg).toHaveAttribute("height", "24")
    })

    it("should render with custom size", () => {
      const { container } = render(
        <ChakraProvider>
          <ArgentIcon width="40" height="40" />
        </ChakraProvider>
      )
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("width", "40")
      expect(svg).toHaveAttribute("height", "40")
    })

    it("should render with correct viewBox", () => {
      const { container } = render(
        <ChakraProvider>
          <ArgentIcon />
        </ChakraProvider>
      )
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24")
    })

    it("should have multiple path elements for shield design", () => {
      const { container } = render(
        <ChakraProvider>
          <ArgentIcon />
        </ChakraProvider>
      )
      const paths = container.querySelectorAll("path")
      expect(paths.length).toBe(3) // Shield has 3 layers
    })
  })
})
