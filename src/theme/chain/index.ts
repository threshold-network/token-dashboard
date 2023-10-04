import { ChainID } from "../../enums"
import { supportedChainId } from "../../utils/getEnvVariable"
import baseTheme from "./base"
import ethereumTheme from "./ethereum"

export const getChainTheme = () => {
  switch (+supportedChainId) {
    case ChainID.Base:
    case ChainID.BaseTestnet:
      return baseTheme
    default:
      return ethereumTheme
  }
}
