import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { getEnvVariable } from "../../utils/getEnvVariable"
import { ChainID, EnvVariable } from "../../enums"

const rpcUrl = getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)
const supportedChainId = getEnvVariable(EnvVariable.SupportedChainId)

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [Number(supportedChainId)]: rpcUrl as string,
  },
  chainId: Number(supportedChainId),
  supportedChainIds: [
    ChainID.Ethereum.valueOf(),
    ChainID.Goerli.valueOf(),
    ChainID.Localhost.valueOf(),
  ],
  qrcode: true,
})
