import { WalletLinkConnector } from "@web3-react/walletlink-connector"
import { getEnvVariable } from "../../utils/getEnvVariable"
import { EnvVariable } from "../../enums"

const rpcUrl = getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)
const supportedChainId = getEnvVariable(EnvVariable.SupportedChainId)

export const coinbaseConnector = new WalletLinkConnector({
  url: rpcUrl,
  appName: "threshold-token-dashboard",
  supportedChainIds: [+supportedChainId],
})

export default coinbaseConnector
