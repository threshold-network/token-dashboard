import T from "@threshold-network/solidity-contracts/artifacts/T.json"
import NuCypherToken from "@threshold-network/solidity-contracts/artifacts/NuCypherToken.json"
import KeepToken from "@keep-network/keep-core/artifacts/KeepToken.json"
import { ethers } from "ethers"
import { ITokens, Tokens } from ".."
import { ERC20TokenWithApproveAndCall } from "../erc20"
import { EthereumConfig } from "../../types"
import { getContractAddressFromTruffleArtifact } from "../../utils"

jest.mock("../erc20", () => ({
  ...(jest.requireActual("../erc20") as {}),
  ERC20TokenWithApproveAndCall: jest.fn(),
}))

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContractAddressFromTruffleArtifact: jest.fn(),
}))

jest.mock("@threshold-network/solidity-contracts/artifacts/T.json", () => ({
  address: "0x6A55B762689Ba514569E565E439699aBC731f156",
  abi: [],
}))

jest.mock(
  "@threshold-network/solidity-contracts/artifacts/NuCypherToken.json",
  () => ({
    address: "0xd696d5a9b083959587F30e487038529a876b08C2",
    abi: [],
  })
)

jest.mock("@keep-network/keep-core/artifacts/KeepToken.json", () => ({
  address: "0x73A63e2Be2D911dc7eFAc189Bfdf48FbB6532B5b",
  abi: [],
}))

describe("ERC20 token test", () => {
  let tokens: ITokens
  let config: EthereumConfig
  const account = "0xaC1933A3Ee78A26E16030801273fBa250631eD5f"
  const keepTokenAddress = (KeepToken as unknown as { address: string }).address

  beforeEach(() => {
    config = {
      providerOrSigner: {} as ethers.providers.Provider,
      chainId: 1,
      account,
    }
    ;(getContractAddressFromTruffleArtifact as jest.Mock).mockReturnValue(
      keepTokenAddress
    )
    tokens = new Tokens(config)
  })

  test("should create the Tokens wrapper correctly", () => {
    expect(ERC20TokenWithApproveAndCall).toHaveBeenNthCalledWith(1, config, {
      address: T.address,
      abi: T.abi,
    })
    expect(ERC20TokenWithApproveAndCall).toHaveBeenNthCalledWith(2, config, {
      address: NuCypherToken.address,
      abi: NuCypherToken.abi,
    })
    expect(ERC20TokenWithApproveAndCall).toHaveBeenNthCalledWith(3, config, {
      address: keepTokenAddress,
      abi: KeepToken.abi,
    })
    expect(tokens.t).toBeInstanceOf(ERC20TokenWithApproveAndCall)
    expect(tokens.keep).toBeInstanceOf(ERC20TokenWithApproveAndCall)
    expect(tokens.nu).toBeInstanceOf(ERC20TokenWithApproveAndCall)
  })
})
