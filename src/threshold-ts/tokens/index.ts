import T from "@threshold-network/solidity-contracts/artifacts/T.json"
import NuCypherToken from "@threshold-network/solidity-contracts/artifacts/NuCypherToken.json"
import KeepToken from "@keep-network/keep-core/artifacts/KeepToken.json"
import TBTCV1Token from "@keep-network/tbtc/artifacts/TBTCToken.json"
import TBTC from "@keep-network/tbtc-v2/artifacts/TBTC.json"
import { IERC20WithApproveAndCall, ERC20TokenWithApproveAndCall } from "./erc20"
import { EthereumConfig } from "../types"
import { getContractAddressFromTruffleArtifact } from "../utils"

export interface ITokens {
  t: IERC20WithApproveAndCall
  keep: IERC20WithApproveAndCall
  nu: IERC20WithApproveAndCall
  tbtcv1: IERC20WithApproveAndCall
  tbtc: IERC20WithApproveAndCall
}

export class Tokens implements ITokens {
  public readonly t: IERC20WithApproveAndCall
  public readonly nu: IERC20WithApproveAndCall
  public readonly keep: IERC20WithApproveAndCall
  public readonly tbtcv1: IERC20WithApproveAndCall
  public readonly tbtc: IERC20WithApproveAndCall

  constructor(config: EthereumConfig) {
    this.t = new ERC20TokenWithApproveAndCall(config, {
      address: T.address,
      abi: T.abi,
    })
    this.nu = new ERC20TokenWithApproveAndCall(config, {
      address: NuCypherToken.address,
      abi: NuCypherToken.abi,
    })
    this.keep = new ERC20TokenWithApproveAndCall(config, {
      address: getContractAddressFromTruffleArtifact(KeepToken),
      abi: KeepToken.abi,
    })
    this.tbtcv1 = new ERC20TokenWithApproveAndCall(config, {
      address: getContractAddressFromTruffleArtifact(TBTCV1Token),
      abi: TBTCV1Token.abi,
    })
    this.tbtc = new ERC20TokenWithApproveAndCall(config, {
      address: TBTC.address,
      abi: TBTC.abi,
    })
  }
}
