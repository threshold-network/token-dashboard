import { render, screen } from "@testing-library/react"
import App from "./App"

test("renders learn react link", () => {
  render(<App />)
  const header = screen.getByText("Threshold Token Dashboard")
  expect(header).toBeInTheDocument()
})
