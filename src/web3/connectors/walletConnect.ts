import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { getEnvVariable } from "../../utils/getEnvVariable"
import { EnvVariable } from "../../enums"

const rpcUrl = getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)
const supportedChainId = getEnvVariable(EnvVariable.SupportedChainId)

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [Number(supportedChainId)]: rpcUrl as string,
  },
  supportedChainIds: [Number(supportedChainId)],
  qrcode: true,
})
