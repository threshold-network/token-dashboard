import baseTheme from "./base"
import ethereumTheme from "./ethereum"

export const getChainTheme = () => {
  // TODO: return the correct theme based on the env variable.
  return ethereumTheme
}
