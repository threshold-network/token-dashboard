import { WalletLinkConnector } from "@web3-react/walletlink-connector"
import { supportedChainId, getEnvVariable } from "../../utils/getEnvVariable"
import { EnvVariable } from "../../enums"

const rpcUrl = getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)

export const coinbaseConnector = new WalletLinkConnector({
  url: rpcUrl,
  appName: "threshold-token-dashboard",
  supportedChainIds: [+supportedChainId],
})
