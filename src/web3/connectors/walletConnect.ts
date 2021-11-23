import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { getEnvVariable } from "../../utils/getEnvVariable"
import { EnvVariable } from "../../enums"

const infuraId = getEnvVariable(EnvVariable.InfuraID)
const supportedChainId = getEnvVariable(EnvVariable.SupportedChainId)

export const walletconnect = new WalletConnectConnector({
  infuraId,
  supportedChainIds: [Number(supportedChainId)],
  qrcode: true,
})
